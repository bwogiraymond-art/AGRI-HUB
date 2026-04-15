import { useMarket } from '../context/MarketContext';
import type { QualityGrade } from '../types/market.types';

export function useQueue() {
  const { queue, updateQueueItem, addActivity } = useMarket();

  const pendingItems = queue.filter(
    q => q.status === 'pending' || q.status === 'flagged'
  );

  const verifyItem = (ref: string, grade: QualityGrade, notes: string, officialId: string) => {
    const item = queue.find(q => q.ref === ref);
    if (!item) return;

    const isReject = grade === 'F';
    updateQueueItem(ref, {
      status: isReject ? 'rejected' : 'verified',
      officialGrade: grade,
      officialNotes: notes,
      officialId,
      verifiedAt: new Date().toISOString(),
    });

    const time = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
    addActivity({
      text: isReject
        ? `Rejected ${item.crop} ${item.quantityKg}kg — Quality fail (${item.farmerId})`
        : `Verified ${item.crop} ${item.quantityKg}kg — Official Grade ${grade} (${item.farmerId})`,
      time,
      color: isReject ? '#A32D2D' : '#3B6D11',
    });
  };

  const flagItem = (ref: string) => {
    const item = queue.find(q => q.ref === ref);
    if (!item) return;
    updateQueueItem(ref, { status: 'flagged' });
    const time = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
    addActivity({
      text: `Flagged ${item.crop} ${item.quantityKg}kg for review (${item.farmerId})`,
      time,
      color: '#854F0B',
    });
  };

  return { queue, pendingItems, pendingCount: pendingItems.length, verifyItem, flagItem };
}
