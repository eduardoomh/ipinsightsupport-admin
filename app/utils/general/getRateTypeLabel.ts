export enum RateType {
  engineering = "engineering",
  architecture = "architecture",
  senior_architecture = "senior_architecture"
}

export function getRateTypeLabel(rateType: RateType): string {
  switch (rateType) {
    case RateType.engineering:
      return "Engineering";
    case RateType.architecture:
      return "Architecture";
    case RateType.senior_architecture:
      return "Senior Architecture";
    default:
      return rateType; // fallback
  }
}