import os
from ultralytics import YOLO

# 1. Map absolute paths based on your cloned repo structure
model_path = os.path.abspath("SIH_Wildlife/edge_prototype/weights/best.pt")
yaml_path = os.path.abspath("dataset/filtered_data.yaml")

print(f"[INFO] Loading model from: {model_path}")
print(f"[INFO] Using dataset config: {yaml_path}")

# 2. Load the fine-tuned weights
model = YOLO(model_path)

# 3. Run the validation sequence on the 'test' split
print("[INFO] Starting evaluation on the TEST split...")
metrics = model.val(
    data=yaml_path,
    split='test',    
    imgsz=640,
    batch=16,
    project='SIH_Wildlife',
    name='edge_test_results'
)

# 4. Output the metrics for your hackathon pitch
print("\n" + "=" * 50)
print("TESTING COMPLETE! HERE ARE YOUR RESULTS:")
print("=" * 50)
print(f"Mean Average Precision @ 0.50 (mAP50): {metrics.box.map50:.4f}")
print(f"Mean Average Precision @ 0.50-0.95:    {metrics.box.map:.4f}")
print(f"Overall Precision:                       {metrics.box.mp:.4f}")
print(f"Overall Recall:                          {metrics.box.mr:.4f}")
print("=" * 50)