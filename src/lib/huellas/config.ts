export function isDemo() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  )
    throw new Error("El modo demo solo está permitido en desarrollo local.");
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  );
}
