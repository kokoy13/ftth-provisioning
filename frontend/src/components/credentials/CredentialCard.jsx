/**
 * Reusable credential form card wrapper.
 */
const CredentialCard = ({ title, icon: Icon, headerRight, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default CredentialCard;
