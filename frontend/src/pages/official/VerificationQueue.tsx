import { useState } from 'react';
import { useAuth }   from '../../context/AuthContext';
import { useQueue }  from '../../hooks/useQueue';
import { useToast }  from '../../hooks/useToast';
import { Modal, GradeButton, StatusPill, Toast } from '../../components/ui';
import type { QualityGrade, QueueItem } from '../../types/market.types';
import { formatUGX } from '../../utils/formatters';

const GRADE_LABELS: Record<QualityGrade, string> = { A:'Grade A', B:'Grade B', C:'Grade C', F:'Reject' };

export default function VerificationQueue() {
  const { user }                          = useAuth();
  const { queue, verifyItem, flagItem }   = useQueue();
  const { toasts, show }                  = useToast();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeItem,   setActiveItem]   = useState<QueueItem | null>(null);
  const [grade,        setGrade]        = useState<QualityGrade | null>(null);
  const [notes,        setNotes]        = useState('');

  // Filter logic
  const filtered = queue.filter(item => {
    const matchText = !search ||
      item.crop.toLowerCase().includes(search.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(search.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchText && matchStatus;
  });

  const openModal = (item: QueueItem) => {
    setActiveItem(item);
    setGrade(null);
    setNotes('');
  };

  const handleVerify = () => {
    if (!activeItem || !grade) { show('Please assign a quality grade before confirming.', 'warning'); return; }
    verifyItem(activeItem.ref, grade, notes, user?.id ?? '');
    show(
      grade === 'F'
        ? `Rejected: ${activeItem.crop} ${activeItem.quantityKg}kg (${activeItem.ref})`
        : `Verified: ${activeItem.crop} ${activeItem.quantityKg}kg — Grade ${grade} (${activeItem.ref})`,
      grade === 'F' ? 'error' : 'success',
    );
    setActiveItem(null);
  };

  const handleFlag = (item: QueueItem) => {
    flagItem(item.ref);
    show(`Flagged for review: ${item.crop} ${item.quantityKg}kg (${item.ref})`, 'warning');
  };

  const GRADES: QualityGrade[] = ['A', 'B', 'C', 'F'];

  return (
    <div>
      {toasts.map(t => <Toast key={t.id} message={t.message} variant={t.variant} />)}

      {/* Verification modal */}
      <Modal
        isOpen={!!activeItem}
        title={`Verify produce — ${activeItem?.ref ?? ''}`}
        onClose={() => setActiveItem(null)}
      >
        {activeItem && (
          <>
            {/* Detail rows */}
            {[
              ['Farmer',            `${activeItem.farmerName} (${activeItem.farmerId})`],
              ['Crop',               activeItem.crop],
              ['Quantity',          `${activeItem.quantityKg} kg`],
              ['Source',             activeItem.sourceDistrict],
              ['Self-assessed grade', `Grade ${activeItem.selfGrade}`],
              ['Asking price',       formatUGX(activeItem.askingPricePerKg) + '/kg'],
            ].map(([label, val]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '0.5px solid var(--color-border-tertiary)',
                fontSize: 13,
              }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{val}</span>
              </div>
            ))}

            {/* Grade selector */}
            <div style={{ marginTop: 14 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>
                Assign official quality grade
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {GRADES.map(g => (
                  <GradeButton key={g} grade={g} selected={grade === g} onClick={setGrade} />
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Official notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Good colour, slight moisture — downgraded to B..."
                style={{ minHeight: 56 }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                className="btn"
                style={{ flex: 2, background: '#EAF3DE', color: '#27500A', border: '0.5px solid #C0DD97' }}
                onClick={handleVerify}
              >
                Confirm verification →
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveItem(null)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Queue table */}
      <div className="card">
        <div className="card-head">
          <h3>Verification queue</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search farmer or crop..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 12, padding: '5px 10px', width: 200, border: '0.5px solid var(--color-border-secondary)', borderRadius: 5, fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ fontSize: 12, padding: '5px 8px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 5, fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Farmer ID</th>
                <th>Crop</th>
                <th>Qty (kg)</th>
                <th>Source</th>
                <th>Self grade</th>
                <th>Asking (UGX/kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                    No items match your search.
                  </td>
                </tr>
              )}
              {filtered.map(item => {
                const isPending = item.status === 'pending' || item.status === 'flagged';
                return (
                  <tr key={item.ref}>
                    <td style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11 }}>{item.ref}</td>
                    <td style={{ fontSize: 12 }}>{item.farmerId}</td>
                    <td style={{ fontWeight: 500 }}>{item.crop}</td>
                    <td>{item.quantityKg}</td>
                    <td>{item.sourceDistrict}</td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4,
                        background: item.selfGrade === 'A' ? '#EAF3DE' : item.selfGrade === 'B' ? '#E6F1FB' : '#FAEEDA',
                        color:      item.selfGrade === 'A' ? '#27500A' : item.selfGrade === 'B' ? '#0C447C' : '#633806',
                      }}>
                        Grade {item.selfGrade}
                      </span>
                    </td>
                    <td>{formatUGX(item.askingPricePerKg)}</td>
                    <td><StatusPill status={item.status} /></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {isPending ? (
                        <>
                          <button
                            className="btn"
                            style={{ fontSize: 11, padding: '3px 10px', marginRight: 4, background: '#EAF3DE', color: '#27500A', border: '0.5px solid #C0DD97' }}
                            onClick={() => openModal(item)}
                          >
                            Verify
                          </button>
                          <button
                            className="btn"
                            style={{ fontSize: 11, padding: '3px 10px', background: '#FCEBEB', color: '#791F1F', border: '0.5px solid #F7C1C1' }}
                            onClick={() => handleFlag(item)}
                          >
                            Flag
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: 11, padding: '3px 10px' }}
                          onClick={() => openModal(item)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
