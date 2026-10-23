import React from 'react';

export interface VehicleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * SUV / 4×4: High ground-clearance off-road silhouette with expedition roof bars
 */
export const SuvIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Expedition roof bars */}
    <path d="M6 5.5h12" />
    <path d="M8 5.5v1.8" />
    <path d="M16 5.5v1.8" />
    {/* Rugged cabin & body profile */}
    <path d="M3 14v-2.2a1.5 1.5 0 0 1 1.1-1.45l3.4-.95a2 2 0 0 1 1-.05l7 .9a2 2 0 0 0 1.2.1l2.4.6A1.5 1.5 0 0 1 20.5 12.3V14" />
    <path d="M2 14h20v2a1 1 0 0 1-1 1h-1.5" />
    <path d="M2 16h2.5" />
    {/* Alpine window divide */}
    <path d="M8 10.2 6.6 13.2h5.4V9.8" />
    <path d="M13.2 10v3.2h5.6l-1-2.4" />
    {/* Wheels & ground clearance */}
    <circle cx="7" cy="17.5" r="2.2" />
    <circle cx="7" cy="17.5" r="0.75" fill="currentColor" />
    <circle cx="17" cy="17.5" r="2.2" />
    <circle cx="17" cy="17.5" r="0.75" fill="currentColor" />
    <path d="M9.2 17.5h5.6" />
  </svg>
);

/**
 * Sedan: Aerodynamic 3-box profile (distinct hood, raked windshield, trunk boot)
 */
export const SedanIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* 3-box sleek aerodynamic silhouette */}
    <path d="M2 14.5v-1.2c0-.5.3-.9.7-1.1l4-1.7a3 3 0 0 1 1.2-.25h6.2a3 3 0 0 1 2 .75l3.2 2.6H21c.6 0 1 .4 1 1v1" />
    <path d="M2 14.5h20v1.2a.8.8 0 0 1-.8.8H19.5" />
    <path d="M2 15.5h2.5" />
    {/* Windshield & side passenger windows */}
    <path d="M7.8 11.5 9.2 8.5h4.6a2 2 0 0 1 1.5.7l2.5 2.3" />
    <path d="M12.5 8.5v3" />
    {/* Wheels */}
    <circle cx="6.5" cy="17" r="2" />
    <circle cx="6.5" cy="17" r="0.75" fill="currentColor" />
    <circle cx="17.5" cy="17" r="2" />
    <circle cx="17.5" cy="17" r="0.75" fill="currentColor" />
    <path d="M8.5 17h7" />
  </svg>
);

/**
 * Hatchback: Compact 2-box profile (short sloping bonnet, steep rear tailgate)
 */
export const HatchbackIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Compact 2-box hatchback silhouette */}
    <path d="M2.5 14v-1a1.2 1.2 0 0 1 .7-1.1l3.6-1.5a2.5 2.5 0 0 1 1-.2h5.7a2 2 0 0 1 1.6.8l3.9 3.5v1.5" />
    <path d="M2 14.5h18.5a.8.8 0 0 1 .8.8v.5a.8.8 0 0 1-.8.8H18" />
    <path d="M2 16h2.5" />
    {/* Windows */}
    <path d="M7.6 11.2 9 8.6h4.8a1.5 1.5 0 0 1 1.2.6l2.8 2" />
    <path d="M12.5 8.6v2.6" />
    {/* Compact wheelbase wheels */}
    <circle cx="6.5" cy="17" r="2" />
    <circle cx="6.5" cy="17" r="0.75" fill="currentColor" />
    <circle cx="16" cy="17" r="2" />
    <circle cx="16" cy="17" r="0.75" fill="currentColor" />
    <path d="M8.5 17h5.5" />
  </svg>
);

/**
 * Coupe: Sports / 2-door aerodynamic fastback with low roofline
 */
export const CoupeIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Low-slung fastback sports coupe */}
    <path d="M2 15v-1.2c0-.5.3-.9.7-1l5.5-2.2a3 3 0 0 1 1.5-.2h4.5a3 3 0 0 1 2.2 1l4.8 2.6H22v1" />
    <path d="M2 15h20v1a.8.8 0 0 1-.8.8H19.5" />
    <path d="M2 16h2.5" />
    {/* Aerodynamic low cabin */}
    <path d="M8.5 11.6 10.5 8h3.8a2 2 0 0 1 1.6.8l3.6 2.8" />
    {/* Wide stance sports wheels */}
    <circle cx="6.5" cy="17" r="2" />
    <circle cx="6.5" cy="17" r="0.75" fill="currentColor" />
    <circle cx="17.5" cy="17" r="2" />
    <circle cx="17.5" cy="17" r="0.75" fill="currentColor" />
    <path d="M8.5 17h7" />
  </svg>
);

/**
 * Shared UTC Bus: Mountain transit bus with destination board, split windscreen & heavy-duty chassis
 */
export const BusIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Coach body */}
    <rect x="4" y="3.5" width="16" height="14.5" rx="2.5" />
    {/* Route banner */}
    <path d="M8 6.5h8" />
    {/* Split windscreen */}
    <path d="M4 11.5h16" />
    <path d="M12 7v4.5" />
    {/* Headlights */}
    <circle cx="7" cy="14.5" r="0.9" fill="currentColor" />
    <circle cx="17" cy="14.5" r="0.9" fill="currentColor" />
    {/* Grille */}
    <path d="M10 14.8h4" />
    {/* Heavy-duty wheels */}
    <rect x="5.5" y="18" width="3" height="3" rx="1" fill="currentColor" />
    <rect x="15.5" y="18" width="3" height="3" rx="1" fill="currentColor" />
  </svg>
);

/**
 * Indian Railways: Locomotive with overhead electric pantograph and mountain rail track
 */
export const TrainIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Electric corridor pantograph */}
    <path d="M9 5 12 2l3 3" />
    {/* Locomotive body */}
    <rect x="4.5" y="5" width="15" height="13" rx="2" />
    {/* Cab windows */}
    <path d="M7.5 9h9" />
    <path d="M12 9v3" />
    <path d="M7.5 12h9" />
    {/* Central & marker lights */}
    <circle cx="12" cy="7" r="0.85" fill="currentColor" />
    <circle cx="7.5" cy="15" r="0.85" fill="currentColor" />
    <circle cx="16.5" cy="15" r="0.85" fill="currentColor" />
    {/* Bumper & Rail track */}
    <path d="M4 18h16" />
    <path d="M3 21h18" />
    <path d="M7 18v3" />
    <path d="M17 18v3" />
  </svg>
);

/**
 * Himalayan Helicopter: Kedarnath / Char Dham alpine rotorcraft with rotor blades, cockpit & skids
 */
export const HelicopterIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Main Rotor Blades */}
    <path d="M3 4.5h18" />
    <path d="M11 4.5v2.5" />
    {/* Bubble Cockpit Fuselage */}
    <path d="M5.5 11c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v1.5c0 1.9-1.6 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 5.5 12.5V11Z" />
    {/* Cockpit Canopy */}
    <path d="M6 10.5h6v4H8.5a2.5 2.5 0 0 1-2.5-2.5v-1.5Z" />
    {/* Tail Boom */}
    <path d="M17.5 10.5H22" />
    {/* Tail Rotor */}
    <path d="M21.5 8v5" />
    <path d="M21.5 8.5l1.5-1.5" />
    {/* Alpine Landing Skids */}
    <path d="M8 16v2.5" />
    <path d="M14 16v2.5" />
    <path d="M5 19.5h12" />
  </svg>
);

/**
 * Regional Flight: Twin-turboprop aircraft serving Dehradun (Jolly Grant) and Pantnagar
 */
export const FlightIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Fuselage & Wings */}
    <path d="M12 2.5c-.8 0-1.5.8-1.5 2.2V16l-7 3.5v1.8l7-2.3V21l-2 1v1l3.5-.8 3.5.8v-1l-2-1v-2l7 2.3v-1.8L13.5 16V4.7c0-1.4-.7-2.2-1.5-2.2Z" />
    {/* Twin turboprop engine nacelles */}
    <path d="M8.5 10.5v3" />
    <path d="M15.5 10.5v3" />
  </svg>
);

/**
 * Generic Private Mountain Vehicle Icon (used in tabs and summaries)
 */
export const PrivateVehicleIcon: React.FC<VehicleIconProps> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Front 3/4 car profile */}
    <path d="M4 14.5v-2a2 2 0 0 1 1.4-1.9l2.8-.9a3 3 0 0 1 1.6 0l5.4 1.7a2 2 0 0 1 1.3 1.9v1.2" />
    <path d="M3 14.5h18a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-1.5" />
    <path d="M3 16h2.5" />
    <circle cx="7" cy="17.5" r="2" />
    <circle cx="17" cy="17.5" r="2" />
    <path d="M9 17.5h6" />
    <path d="M8.5 11.5 9.8 9h4.8l2.2 2.5" />
  </svg>
);

/**
 * Helper to dynamically render a vehicle icon by type key
 */
export const VehicleIconByType: React.FC<{ type: string; className?: string }> = ({
  type,
  className = 'w-4 h-4',
}) => {
  switch (type.toLowerCase()) {
    case 'suv':
      return <SuvIcon className={className} />;
    case 'sedan':
      return <SedanIcon className={className} />;
    case 'hatchback':
      return <HatchbackIcon className={className} />;
    case 'coupe':
      return <CoupeIcon className={className} />;
    case 'bus':
      return <BusIcon className={className} />;
    case 'train':
      return <TrainIcon className={className} />;
    case 'helicopter':
      return <HelicopterIcon className={className} />;
    case 'flight':
      return <FlightIcon className={className} />;
    default:
      return <PrivateVehicleIcon className={className} />;
  }
};
