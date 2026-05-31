# Risk Score Demo

## Purpose

This is a lightweight conceptual scoring model for explaining how Cloud Alley could evolve from an H5 prototype into an AI-assisted spatial decision product.

## Sample Formula

```text
route_risk =
  clearance_penalty
  + balcony_conflict_penalty
  + wind_penalty
  + pedestrian_conflict_penalty
  + privacy_penalty
  - service_efficiency_bonus
```

## Example Scenario A: Balanced Route

| Factor | Value |
| --- | --- |
| Building spacing | 18m |
| Balcony depth | 1.2m |
| Wind speed | 3.5m/s |
| Landing distance | 35m |
| Pedestrian conflict | low |

Interpretation: Suitable for demonstration. Route is feasible if landing node and resident pickup flow are clear.

## Example Scenario B: Balcony Conflict

| Factor | Value |
| --- | --- |
| Building spacing | 12m |
| Balcony depth | 1.8m |
| Wind speed | 4.2m/s |
| Landing distance | 28m |
| Pedestrian conflict | medium |

Interpretation: Balcony projection and privacy risk are high. The design should reduce projection depth, shift route corridor, or move the landing node.

## Example Scenario C: Service Efficient but Spatially Risky

| Factor | Value |
| --- | --- |
| Building spacing | 15m |
| Balcony depth | 1.4m |
| Wind speed | 6.5m/s |
| Landing distance | 18m |
| Pedestrian conflict | high |

Interpretation: Delivery is efficient, but resident comfort and pedestrian conflict are weak. The system should recommend lower-frequency service, alternate route timing, or another delivery node.

## Portfolio Use

This scoring demo can be shown as a planned AI decision module. It proves that the project can evolve beyond a static app prototype into a spatial product that evaluates design trade-offs.
