import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  loading = false,
  disabled = false,
  className = ''
}) => {
  const getTypeConfig = () => {
    const configs = {
      warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        confirmVariant: 'warning',
        borderColor: 'border-yellow-200'
      },
      danger: {
        icon: XCircle,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        confirmVariant: 'danger',
        borderColor: 'border-red-200'
      },
      info: {
        icon: Info,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        confirmVariant: 'primary',
        borderColor: 'border-blue-200'
      },
      success: {
        icon: CheckCircle,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
        confirmVariant: 'success',
        borderColor: 'border-green-200'
      }
    };

    return configs[type] || configs.warning;
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={className}
      closeOnOverlayClick={!loading}
      showCloseButton={false}
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full">
          <div className={`flex items-center justify-center h-12 w-12 rounded-full ${config.iconBg}`}>
            <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          
          {typeof message === 'string' ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
          ) : (
            <div className="text-sm text-gray-600">
              {message}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
            disabled={disabled}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Hook for easier usage
export const useConfirmDialog = () => {
  const [dialog, setDialog] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  const showDialog = (options) => {
    setDialog({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure?',
      onConfirm: options.onConfirm,
      type: options.type || 'warning',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel'
    });
  };

  const hideDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async () => {
    if (dialog.onConfirm) {
      await dialog.onConfirm();
    }
    hideDialog();
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      title={dialog.title}
      message={dialog.message}
      type={dialog.type}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      onConfirm={handleConfirm}
      onClose={hideDialog}
    />
  );

  return {
    showDialog,
    hideDialog,
    ConfirmDialog: ConfirmDialogComponent
  };
};

export default ConfirmDialog;
