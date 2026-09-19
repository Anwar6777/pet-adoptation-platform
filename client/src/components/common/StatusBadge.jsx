const styles = {
  Available: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
  Adopted: 'bg-rose-50 text-rose-700 ring-rose-100',
};

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[status] || styles.Available}`}>{status}</span>;
}

export default StatusBadge;
