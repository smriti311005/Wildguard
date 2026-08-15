import os
import torch
from ultralytics import YOLO


def main():

    # ==========================================
    # 1. CHECK GPU
    # ==========================================
    print("--> Checking GPU...")

    if not torch.cuda.is_available():
        raise RuntimeError(
            "CUDA/GPU is not available in PyTorch. "
            "Please fix the CUDA-enabled PyTorch installation first."
        )

    print(f"--> Using GPU: {torch.cuda.get_device_name(0)}")

    # ==========================================
    # 2. PATH TO PREVIOUS CHECKPOINT
    # ==========================================
    EDGE_AI_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.dirname(EDGE_AI_DIR)

    last_checkpoint = os.path.join(
        PROJECT_ROOT,
        "SIH_Wildlife",
        "edge_prototype",
        "weights",
        "last_gpu.pt"
    )

    print("--> Loading checkpoint:")
    print(f"    {last_checkpoint}")

    if not os.path.exists(last_checkpoint):
        raise FileNotFoundError(
            f"last.pt was not found at:\n{last_checkpoint}"
        )

    # ==========================================
    # 3. LOAD PREVIOUS MODEL
    # ==========================================
    model = YOLO(last_checkpoint)

    # ==========================================
    # 4. RESUME TRAINING ON GPU
    # ==========================================
    print("--> Resuming training on RTX 3050...")

    results = model.train(
    resume=True,
    device=0
)

    print("\n" + "=" * 50)
    print("TRAINING COMPLETE!")
    print("=" * 50)


if __name__ == "__main__":
    main()