import os
import torch

# Original checkpoint
EDGE_AI_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.dirname(EDGE_AI_DIR)

original_checkpoint = os.path.join(
    PROJECT_ROOT,
    "SIH_Wildlife",
    "edge_prototype",
    "weights",
    "last.pt"
)

# New repaired checkpoint
repaired_checkpoint = os.path.join(
    PROJECT_ROOT,
    "SIH_Wildlife",
    "edge_prototype",
    "weights",
    "last_gpu.pt"
)

print("--> Loading original checkpoint:")
print(original_checkpoint)

# Explicitly allow loading the Ultralytics checkpoint
ckpt = torch.load(
    original_checkpoint,
    map_location="cpu",
    weights_only=False
)

print("--> Original scaler:")
print(ckpt.get("scaler"))

# Create a valid GradScaler state
ckpt["scaler"] = {
    "scale": 65536.0,
    "growth_factor": 2.0,
    "backoff_factor": 0.5,
    "growth_interval": 2000,
    "_growth_tracker": 0
}

print("--> Replacing empty scaler with a valid scaler state...")

torch.save(ckpt, repaired_checkpoint)

print("--> Repaired checkpoint saved:")
print(repaired_checkpoint)
print("--> Done!")