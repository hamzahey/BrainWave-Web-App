import torch
import numpy as np
import os
from resnet_trans import CombinedModel
from eeg_dataset_win_lazy import create_test_loader
import get_patients

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model(model_path):
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
        'output_dim': 1,
        'hidden_dim': 64,
        'num_heads': 4,
        'key_query_dim': 32,
        'intermediate_dim': 128
    }

    model = CombinedModel(resnet_config, transformer_config).to(device)
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    return model

def run_inference(model, root_dir):
    if not root_dir or not os.path.exists(root_dir):
        raise ValueError("Invalid directory path")

    patients_data, _ = get_patients.get_patients(root_path=root_dir, prototype=True, per_class=50)
    test_loader = create_test_loader(patients_data, root_dir, batch_size=32, records_per_patient=1, predict='outcome')

    test_preds = []
    with torch.no_grad():
        for inputs, _ in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            test_preds.append(outputs.cpu().numpy())

    return np.concatenate(test_preds).tolist()
