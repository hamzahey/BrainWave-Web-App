import torch
import numpy as np
from resnet_trans import CombinedModel
# from models import CombinedModel  # Assuming the same model architecture as used for training
from eeg_dataset_win_lazy import create_test_loader  # If you need to load data
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
import get_patients

# Define hyperparameters (same as the training code)
batch_size = 20
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the model
def load_model(model_path, device):
    # Define the model with the same configuration as during training
    resnet_config = {
        'in_channels': 19,
        'base_filters': 64,
        'kernel_size': 17,
        'stride': 2,
        'groups': 1,
        'n_block': 4,
        'downsample_gap': 2,
        'increasefilter_gap': 4,
        'use_bn': True,
        'use_do': True,
        'verbose': False
    }

    transformer_config = {
        'output_dim': 1,  # Binary classification
        'hidden_dim': 64,
        'num_heads': 4,
        'key_query_dim': 32,
        'intermediate_dim': 128
    }

    # Initialize the model
    model = CombinedModel(resnet_config, transformer_config).to(device)
    
    # Load the saved model state
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()  # Set the model to evaluation mode
    return model


model_path = './eeg_model.pth'
model = load_model(model_path, device)
# /home/hamzahey/Final Year Project/Dataset/physionet.org/files/i-care/2.1/training
# /home/hamzahey/Test data/training
root_dir = "/home/hamzahey/Test data/training"
patients_data, _ = get_patients.get_patients(root_path=root_dir, prototype=True, per_class=50)
test_loader = create_test_loader(patients_data, root_dir, batch_size=32, records_per_patient=1, predict='outcome')

# Perform inference on the test set
model.eval()
test_preds = []
test_labels = []
all_true_labels = []
all_pred_labels = []
all_outputs = []

with torch.no_grad():
    for inputs, labels in test_loader:
        inputs = inputs.to(device)
        labels = labels.to(device)

        # Perform inference
        outputs = model(inputs)
        print(outputs)
        # Collect predictions and true labels
        test_preds.append(outputs.cpu().numpy())
        test_labels.append(labels.cpu().numpy())

        # Store the outputs and labels for metrics calculation
        all_true_labels.extend(labels.cpu().numpy())
        all_pred_labels.extend((outputs.cpu().numpy() > 0.5).astype(int))  # Binary prediction
        all_outputs.extend(outputs.cpu().numpy())

        # Print True Labels and Predicted Labels for each input
        for true_label, pred_label in zip(labels.cpu().numpy(), (outputs.cpu().numpy() > 0.5).astype(int)):
            print(f"True Label: {true_label}, Predicted Label: {pred_label}")

# # Concatenate predictions and true labels
# test_preds = np.concatenate(test_preds)
# test_labels = np.concatenate(test_labels)

# # Assuming a binary classification task (0 or 1)
# test_pred = (test_preds > 0.5)  # Convert to binary predictions

# # Calculate accuracy, AUC, TPR, FPR
# acc = accuracy_score(test_labels, test_pred)
# auc = roc_auc_score(test_labels, test_preds)

# # Calculate confusion matrix for TPR and FPR
# tn, fp, fn, tp = confusion_matrix(test_labels, test_pred).ravel()

# # Calculate True Positive Rate (TPR) and False Positive Rate (FPR)
# tpr = tp / (tp + fn)  # True Positive Rate / Recall
# fpr = fp / (fp + tn)  # False Positive Rate

# print(f"Test Accuracy: {acc*100:.2f}%")
# print(f"Test AUC: {auc:.4f}")
# print(f"True Positive Rate (TPR): {tpr:.4f}")
# print(f"False Positive Rate (FPR): {fpr:.4f}")



# Concatenate predictions and true labels
test_preds = np.concatenate(test_preds)
test_labels = np.concatenate(test_labels)

# Convert to binary predictions
test_pred = (test_preds > 0.5)  # Convert to 0 or 1


print("test preds are: ",test_preds)
print("test labels are: ",test_labels)

# Calculate accuracy
# acc = accuracy_score(test_labels, test_pred)

# # Check if AUC can be calculated
# if len(np.unique(test_labels)) < 2:
#     print("Only one class present in test labels. Skipping AUC calculation.")
#     auc = None
# else:
#     auc = roc_auc_score(test_labels, test_preds)

# # Calculate confusion matrix for TPR and FPR
# tn, fp, fn, tp = confusion_matrix(test_labels, test_pred).ravel()

# # Calculate True Positive Rate (TPR) and False Positive Rate (FPR)
# tpr = tp / (tp + fn) if (tp + fn) > 0 else 0  # Avoid division by zero
# fpr = fp / (fp + tn) if (fp + tn) > 0 else 0

# print(f"Test Accuracy: {acc*100:.2f}%")
# if auc is not None:
#     print(f"Test AUC: {auc:.4f}")
# print(f"True Positive Rate (TPR): {tpr:.4f}")
# print(f"False Positive Rate (FPR): {fpr:.4f}")
