import os
import matplotlib.pyplot as plt
from wfdb import rdrecord

def plot_eeg_signals(hea_file_path):
    """
    Plots the raw EEG signal and individual EEG channels from a .hea file.
    
    Parameters:
        hea_file_path (str): Path to the .hea file.

    Returns:
        None (Displays the EEG plots)
    """
    try:
        # Load EEG data from .hea file (WFDB assumes .dat file exists in the same directory)
        record = rdrecord(hea_file_path.replace('.hea', ''))  # Remove .hea extension to load correctly
        print("Record: ", record)
        signal = record.p_signal
        print("signal", signal)
        fs = record.fs  # Sampling frequency
        num_channels = len(signal[0])  # Number of EEG channels
        num_samples = len(signal)  # Total number of samples

        print(f"Sampling Frequency: {fs} Hz")
        print(f"Number of Channels: {num_channels}")
        print(f"Signal Length: {num_samples} samples")

        # 🟢 Plot Raw EEG Signal (All Channels Overlaid)
        plt.figure(figsize=(20, 6))
        plt.plot(signal)
        plt.title("Raw EEG Signal (All Channels)")
        plt.xlabel("Samples")
        plt.ylabel("Amplitude")
        plt.show()

        # 🔵 Plot Each EEG Channel Separately (First 1 second of data)
        plt.figure(figsize=(20, 10))
        for i in range(num_channels):
            plt.plot(signal[:fs, i], label=f"Channel {i+1}")

        plt.title("Raw EEG Signal - Separate Channels (First Second)")
        plt.xlabel("Samples")
        plt.ylabel("Amplitude")
        plt.legend()
        plt.show()

    except Exception as e:
        print(f"Error loading EEG data: {e}")


file_path = "eeg-backend/app/0296_005_006_EEG.hea"
plot_eeg_signals(file_path)