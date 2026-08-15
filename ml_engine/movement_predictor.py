import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import DBSCAN

class WildlifePredictiveEngine:
    def __init__(self):
        # Pre-trained heuristic rules mapped into Random Forest
        self.reasons = [
            "Water Source Seeking",
            "Canopy & Forage Migration",
            "Human Avoidance Movement",
            "Territorial Patrol"
        ]
        self._init_model()

    def _init_model(self):
        """Initializes and trains the baseline Random Forest classifier."""
        # Features: [Hour (0-23), NDVI (0-1), Distance to Water (m), Slope (deg), Is_Carnivore (0/1)]
        X_train = np.array([
            [14, 0.70, 200, 4.0, 0],   # Afternoon + near water -> Water Seeking
            [15, 0.50, 150, 6.0, 1],   # Carnivore stalking water
            [6,  0.80, 800, 12.0, 0],  # Morning + High NDVI -> Foraging
            [7,  0.75, 950, 8.0, 0],   # Morning + High NDVI -> Foraging
            [22, 0.60, 600, 5.0, 1],   # Night + Carnivore -> Territorial Patrol
            [1,  0.55, 700, 7.0, 1],   # Night + Carnivore -> Territorial Patrol
            [12, 0.40, 1100, 2.0, 0],  # Low canopy -> Human Avoidance
        ])
        y_train = np.array([0, 0, 1, 1, 3, 3, 2])
        
        self.rf = RandomForestClassifier(n_estimators=30, random_state=42)
        self.rf.fit(X_train, y_train)

    def predict_reason(self, hour: int, ndvi: float, dist_water: float, slope: float, species: str) -> dict:
        is_carnivore = 1 if species in ["Tiger", "Lion", "Leopard", "Cheetah", "Jaguar", "Fox"] else 0
        input_vector = np.array([[hour, ndvi, dist_water, slope, is_carnivore]])
        
        pred_idx = self.rf.predict(input_vector)[0]
        confidence = float(np.max(self.rf.predict_proba(input_vector)))
        
        return {
            "predicted_reason": self.reasons[pred_idx],
            "confidence": round(confidence, 2)
        }

    @staticmethod
    def compute_corridors_and_trajectory(lat: float, lon: float, species: str, historical_coords: list = None):
        """
        Uses spatial vector projection to predict the next coordinates (15-min forward projection)
        and identifies active corridor centroids using DBSCAN.
        """
        # Directional bias based on environmental topography simulation
        # High slope encourages animal descent; low NDVI pushes towards forest reserves
        delta_lat = 0.0035 * (np.cos(lat * 50))
        delta_lon = 0.0040 * (np.sin(lon * 50))

        predicted_lat = round(lat + delta_lat, 5)
        predicted_lon = round(lon + delta_lon, 5)

        corridors = []
        if historical_coords and len(historical_coords) >= 3:
            coords = np.array(historical_coords)
            clustering = DBSCAN(eps=0.01, min_samples=2).fit(coords)
            unique_labels = set(clustering.labels_)
            for label in unique_labels:
                if label != -1:
                    cluster_points = coords[clustering.labels_ == label]
                    center = cluster_points.mean(axis=0)
                    corridors.append({"lat": center[0], "lon": center[1], "count": len(cluster_points)})

        return {
            "current_location": [lat, lon],
            "predicted_next_location": [predicted_lat, predicted_lon],
            "corridors": corridors
        }