export function calculatePriority(needs, volunteers) {
  if (needs === 0) return { label: 'Completed', color: 'bg-green-100 text-green-700' };
  
  const coverage = volunteers / needs;
  
  if (coverage < 0.3) {
    return { label: 'Critical', color: 'bg-red-100 text-red-700' };
  } else if (coverage < 0.7) {
    return { label: 'High', color: 'bg-orange-100 text-orange-700' };
  } else if (coverage >= 1) {
    return { label: 'Fulfilled', color: 'bg-green-100 text-green-700' };
  } else {
    return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
  }
}