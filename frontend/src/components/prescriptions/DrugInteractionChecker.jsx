import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import Button from '../common/Button';

const DrugInteractionChecker = ({ interactions = [], isOpen, onClose }) => {
  if (!isOpen || interactions.length === 0) return null;

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'SEVERE':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'MODERATE':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'MILD':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'SEVERE':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'MILD':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const severeInteractions = interactions.filter(i => i.severity === 'SEVERE');
  const moderateInteractions = interactions.filter(i => i.severity === 'MODERATE');
  const mildInteractions = interactions.filter(i => i.severity === 'MILD');

  return (
    <div className={`border rounded-lg p-4 ${
      severeInteractions.length > 0 ? 'border-red-300 bg-red-50' :
      moderateInteractions.length > 0 ? 'border-yellow-300 bg-yellow-50' :
      'border-blue-300 bg-blue-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`h-5 w-5 ${
            severeInteractions.length > 0 ? 'text-red-600' :
            moderateInteractions.length > 0 ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <h4 className="font-semibold text-gray-900">
            Drug Interaction Warning
          </h4>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        {severeInteractions.length > 0 
          ? 'Critical drug interactions detected. Review carefully before prescribing.'
          : moderateInteractions.length > 0
          ? 'Moderate drug interactions detected. Consider alternative medications.'
          : 'Minor drug interactions detected. Monitor patient for side effects.'
        }
      </p>

      <div className="space-y-3">
        {interactions.map((interaction, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 ${getSeverityColor(interaction.severity)}`}
          >
            <div className="flex items-start space-x-3">
              {getSeverityIcon(interaction.severity)}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h5 className="font-medium">
                    {interaction.medication1} + {interaction.medication2}
                  </h5>
                  <span className="px-2 py-0.5 text-xs font-medium rounded">
                    {interaction.severity}
                  </span>
                </div>
                
                <p className="text-sm mb-2">
                  {interaction.description}
                </p>

                {interaction.effects && interaction.effects.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1">Potential Effects:</p>
                    <ul className="text-xs space-y-1">
                      {interaction.effects.map((effect, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {interaction.recommendation && (
                  <div className="bg-white bg-opacity-50 rounded p-2 mt-2">
                    <p className="text-xs">
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </p>
                  </div>
                )}

                {interaction.management && (
                  <div className="mt-2">
                    <p className="text-xs">
                      <strong>Management:</strong> {interaction.management}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-700">
          <strong>Note:</strong> This is an automated check. Please consult drug interaction databases 
          and use clinical judgment when prescribing medications with potential interactions.
        </p>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;
