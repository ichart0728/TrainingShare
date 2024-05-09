export const getMax = (
  data: { weight?: number; bodyFatPercentage?: number; muscleMass?: number }[]
): number => {
  const values = data.map(
    (item) => item.weight || item.bodyFatPercentage || item.muscleMass || 0
  );
  return Math.max(...values);
};

export const getMin = (
  data: { weight?: number; bodyFatPercentage?: number; muscleMass?: number }[]
): number => {
  const values = data.map(
    (item) => item.weight || item.bodyFatPercentage || item.muscleMass || 0
  );
  return Math.min(...values);
};
