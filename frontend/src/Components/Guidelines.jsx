import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ComponentStyles/Guidelines.css';

const defaultGuidelines = {
  '/items': {
    title: 'Items Entry Guidelines',
    items: [
      'Enter accurate production and machine details for traceability.',
      'Use the calendar picker to choose the correct inspection date.',
      'Use filters to narrow results before exporting or saving.',
      'Include part and batch numbers to link items to tests and reports.'
    ]
  },
  '/spectro-analysis': {
    title: 'Spectro Analysis Guidelines',
    items: [
      'Record alloy composition results precisely and include units.',
      'Provide Heat No. and FC No. for traceability to melts and casts.',
      'Verify instrument calibration and note any anomalies in remarks.',
      'Attach sample IDs and operator initials for accountability.'
    ]
  },
  '/process-control': {
    title: 'Process Control Guidelines',
    items: [
      'Log target and actual values for each control point consistently.',
      'Record deviations and corrective actions immediately.',
      'Maintain control charts for trend analysis and audits.',
      'Include operator and supervisor details for each entry.'
    ]
  },
  '/overall-reports': {
    title: 'Reporting Guidelines',
    items: [
      'Apply appropriate filters (date, machine, heat, part) before generating reports.',
      'Validate the dataset is complete before exporting.',
      'Use consistent time ranges when comparing historical data.',
      'Annotate aggregated results with contextual notes when needed.'
    ]
  },
  '/production/mechanical-properties': {
    title: 'Mechanical Testing Guidelines',
    items: [
      'Follow the referenced test standard (ASTM/ISO) for each test.',
      'Record specimen type, dimensions and conditioning details.',
      'Report tensile, yield, elongation and hardness using units.',
      'Ensure and record instrument calibration dates.'
    ]
  },
  '/production/metallography-properties': {
    title: 'Metallography Guidelines',
    items: [
      'Label samples clearly and record magnification and etchants used.',
      'Document specimen preparation steps and imaging conditions.',
      'Capture representative micrographs and annotate notable features.',
      'Record grain size, phases and inclusion observations.'
    ]
  },
  '/process/melting-parameters': {
    title: 'Melting & Furnace Guidelines',
    items: [
      'Record furnace temperature, melt time and heat number for each batch.',
      'Log alloy additions and measured chemical composition.',
      'Note refractory condition and any process interruptions.',
      'Link melt records to downstream castings and spectro reports.'
    ]
  },
  '/process/molding-parameters': {
    title: 'Molding Process Guidelines',
    items: [
      'Record cycle time, mold temperature and injection settings.',
      'Note deviations from standard parameters and attach remarks.',
      'Maintain mold maintenance and cleaning logs.',
      'Include part numbers and machine IDs for each cycle.'
    ]
  },
  '/process/sandplant-process-parameters': {
    title: 'Sandplant Guidelines',
    items: [
      'Measure and record moisture, clay and permeability values.',
      'Log mixing times and batch sizes for reproducibility.',
      'Perform routine sand quality tests and archive results.',
      'Record supplier changes or sand type adjustments with dates.'
    ]
  },
  '/rejection/report-founded': {
    title: 'Foundry Rejection Guidelines',
    items: [
      'Describe the defect type, severity and exact location.',
      'Record measurements and attach photos where possible.',
      'Follow rejection disposition procedures and document actions.',
      'Capture root-cause analysis and corrective actions taken.'
    ]
  },
  '/rejection/report-machine': {
    title: 'Machine Shop Rejection Guidelines',
    items: [
      'Record operation number and machine ID for each rejection.',
      'Measure critical dimensions using calibrated gauges and log the values.',
      'Document surface finish and other non-dimensional defects.',
      'Include inspector notes and follow-up corrective actions.'
    ]
  },
  '/analytics': {
    title: 'Analytics Guidelines',
    items: [
      'Use consistent filters and timeframes when comparing datasets.',
      'Export raw data for additional analysis when required.',
      'Annotate charts with known process changes or events.',
      'Validate input data completeness before interpreting trends.'
    ]
  },
  '/login': {
    title: 'Login & Access Notes',
    items: [
      'Use assigned credentials; never share accounts.',
      'Report authentication or permission issues to IT with timestamps.',
      'Ensure your role has the correct permissions for your tasks.'
    ]
  }
};

const Guidelines = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    // Show guidelines whenever the route changes
    const path = location.pathname.replace(/\/$/, '');
    const entry = defaultGuidelines[path] || { title: 'General Guidelines', items: ['Follow the on-screen instructions.'] };
    // update the content for the current route but do not auto-open
    setContent(entry);
  }, [location]);

  // Apply HTML `required` attribute to form controls across pages
  useEffect(() => {
    const applyRequired = () => {
      try {
        const els = document.querySelectorAll('input, select, textarea');
        els.forEach((el) => {
          const tag = el.tagName.toLowerCase();
          const type = el.getAttribute('type');
          // Skip controls that are readonly, disabled or form buttons
          if (el.hasAttribute('readonly') || el.hasAttribute('disabled')) return;
          if (type && ['button', 'submit', 'reset', 'hidden', 'image'].includes(type)) return;
          // Mark as required
          el.setAttribute('required', 'true');
        });
      } catch (err) {
        // ignore in non-browser environments
      }
    };

    applyRequired();
  }, [location]);

  // Add live validation: toggle classes and intercept saves
  useEffect(() => {
    let listeners = [];
    try {
      const controls = Array.from(document.querySelectorAll('input, select, textarea'));

      const stateMap = new WeakMap();

      const shouldSkip = (el) => {
        if (!el) return true;
        if (el.disabled || el.readOnly) return true;
        const type = el.getAttribute('type');
        if (type && ['button','submit','reset','hidden','image'].includes(type)) return true;
        return false;
      };

      const validateEl = (el, opts = { onInput: false, onBlur: false }) => {
        if (shouldSkip(el)) return;
        el.classList.add('validated-control');

        const value = el.value;
        const hasValue = value !== null && value !== undefined && String(value).trim() !== '';
        const isValid = el.checkValidity ? el.checkValidity() : !!value;

        // Track whether user has touched/blurred the control
        const st = stateMap.get(el) || { touched: false };

        if (opts.onBlur) st.touched = true;
        if (opts.onInput) st.touched = st.touched || hasValue;
        stateMap.set(el, st);

        // Clear both classes by default (neutral)
        el.classList.remove('invalid');
        el.classList.remove('valid');

        // Only show invalid when user has interacted (touched) and it's invalid
        if (!isValid && st.touched) {
          el.classList.add('invalid');
        } else if (isValid && hasValue) {
          // Show valid when a non-empty valid value exists
          el.classList.add('valid');
        }
      };

      controls.forEach((el) => {
        const onInput = () => validateEl(el, { onInput: true });
        const onChange = () => validateEl(el, { onInput: true });
        const onBlur = () => validateEl(el, { onBlur: true });
        el.addEventListener('input', onInput);
        el.addEventListener('change', onChange);
        el.addEventListener('blur', onBlur);
        listeners.push(() => {
          el.removeEventListener('input', onInput);
          el.removeEventListener('change', onChange);
          el.removeEventListener('blur', onBlur);
        });
        // initial state: neutral (do not mark invalid on load)
        validateEl(el, { onInput: false, onBlur: false });
      });

      // Intercept Save/Submit buttons (heuristic: text/content includes 'save' or 'submit')
      const buttons = Array.from(document.querySelectorAll('button'));
      const saveButtons = buttons.filter(b => {
        const txt = (b.innerText || '').toLowerCase();
        return txt.includes('save') || txt.includes('submit');
      });

      const onSaveClick = (e) => {
        // Validate all controls before allowing default
        const els = Array.from(document.querySelectorAll('input, select, textarea'));
        let allValid = true;
        els.forEach((el) => {
          if (el.disabled || el.readOnly) return;
          const type = el.getAttribute('type');
          if (type && ['button','submit','reset','hidden','image'].includes(type)) return;
          if (el.checkValidity && !el.checkValidity()) {
            allValid = false;
            el.classList.add('invalid');
            el.classList.remove('valid');
          }
        });
        if (!allValid) {
          e.preventDefault();
          e.stopPropagation();
          // focus first invalid and apply a brief shake animation instead of showing guidelines
          const firstInvalid = document.querySelector('.validated-control.invalid');
          if (firstInvalid) {
            try {
              firstInvalid.focus();
              firstInvalid.classList.add('shake');
              setTimeout(() => firstInvalid.classList.remove('shake'), 600);
            } catch (err) {}
          }
        }
      };

      saveButtons.forEach(b => {
        b.addEventListener('click', onSaveClick);
        listeners.push(() => b.removeEventListener('click', onSaveClick));
      });

    } catch (err) {
      // ignore
    }

    return () => {
      listeners.forEach(fn => { try { fn(); } catch(e){} });
    };
  }, [location]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener('guidelines:open', onOpen);
    return () => document.removeEventListener('guidelines:open', onOpen);
  }, []);

  return (
    <>
      {open && (
        <div className="guidelines-overlay" onClick={() => setOpen(false)}>
          <div className="guidelines-popup" onClick={(e) => e.stopPropagation()}>
            <div className="guidelines-header">
              <h3>Guidelines</h3>
              <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="guidelines-body">
              <h4 style={{ marginTop: 0 }}>{content.title}</h4>
              <ul>
                {content.items && content.items.map((it, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Guidelines;
