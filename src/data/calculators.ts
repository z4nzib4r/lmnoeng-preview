// Calculator directory for the homepage redesign concept.
// Category and calculator names reflect LMNO Engineering's published calculator topics;
// links are placeholders (#) until mapped to the live URLs on lmnoeng.com.

/** Calculators that have a page in this preview. */
export const calcLinks: Record<string, string> = {
  'Circular culvert': '/calculators/circular-culvert',
};

export interface Category {
  id: string;
  title: string;
  blurb: string;
  icon: string; // SVG path data, drawn on a 24x24 grid
  calcs: string[];
}

export const categories: Category[] = [
  {
    id: 'open-channel',
    title: 'Open channel flow',
    blurb: 'Manning and Chezy equations, critical depth, and hydraulic jumps for any channel shape.',
    icon: 'M3 7v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 13c3 0 3-2 6-2s3 2 6 2 3-2 6-2',
    calcs: [
      "Manning's equation",
      'Circular culvert',
      'Trapezoidal channel',
      'Triangular channel',
      'Critical depth',
      'Hydraulic jump',
      'Chezy equation',
    ],
  },
  {
    id: 'pipe-flow',
    title: 'Pipe flow & pressure',
    blurb: 'Head loss, friction factors, and pressure drop in full-flowing pipes and fittings.',
    icon: 'M2 9h6a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4h6M2 13h6M16 13h6M2 7v8M22 15v4',
    calcs: [
      'Darcy-Weisbach',
      'Hazen-Williams',
      'Pipe head loss',
      'Minor losses (K)',
      'Friction factor',
      'Water hammer',
      'Pump power',
    ],
  },
  {
    id: 'weirs-flumes',
    title: 'Weirs & flumes',
    blurb: 'Flow rates from head measurements for standard weirs and measuring flumes.',
    icon: 'M3 20h18M5 20V9l7 6 7-6v11M3 6c2 0 2-1.5 4.5-1.5S10 6 12 6s2-1.5 4.5-1.5S19 6 21 6',
    calcs: [
      'V-notch weir',
      'Rectangular weir',
      'Cipolletti weir',
      'Broad-crested weir',
      'Parshall flume',
      'Montana flume',
      'Palmer-Bowlus flume',
    ],
  },
  {
    id: 'meters',
    title: 'Orifices & flow meters',
    blurb: 'Differential-pressure meters, nozzles, gates, and tank drain times.',
    icon: 'M12 3v4M5 12H3M21 12h-2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 12l4-4',
    calcs: [
      'Orifice flow',
      'Venturi meter',
      'Flow nozzle',
      'Sluice gate',
      'Tank draining',
      'Pitot tube',
    ],
  },
  {
    id: 'hydrology',
    title: 'Hydrology & stormwater',
    blurb: 'Runoff, time of concentration, and detention sizing for site and watershed design.',
    icon: 'M7 16a4 4 0 1 1 .8-7.9A5.5 5.5 0 0 1 18.5 9 3.5 3.5 0 0 1 18 16M8 19l-1 2M12 19l-1 2M16 19l-1 2',
    calcs: [
      'Rational method',
      'SCS curve number',
      'Time of concentration',
      'Detention pond',
      'Rainfall intensity',
    ],
  },
  {
    id: 'groundwater',
    title: 'Groundwater & wells',
    blurb: 'Well drawdown, aquifer properties, and seepage through porous media.',
    icon: 'M12 3v12M9 12l3 3 3-3M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2-1.5 4.5-1.5S19 18 21 18M3 21h18',
    calcs: [
      "Darcy's law",
      'Theis well drawdown',
      'Thiem equation',
      'Hydraulic conductivity',
      'Seepage velocity',
    ],
  },
  {
    id: 'environmental',
    title: 'Air & environmental',
    blurb: 'Pollutant dispersion, settling, and mixing for air and water quality work.',
    icon: 'M4 18h4a3 3 0 0 0 0-6H3M10 8h8a3 3 0 1 0-3-3M6 22h10a3 3 0 1 0-3-3',
    calcs: [
      'Gaussian plume',
      "Stokes' settling",
      'Stack plume rise',
      'Mixing & dilution',
      'Reaction kinetics',
    ],
  },
  {
    id: 'units',
    title: 'Properties & conversions',
    blurb: 'Fluid properties and quick unit conversions for flow, pressure, and more.',
    icon: 'M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7',
    calcs: [
      'Water properties',
      'Air properties',
      'Flow rate converter',
      'Pressure converter',
      'Viscosity converter',
    ],
  },
];

export const popular = [
  {
    title: "Manning's equation",
    category: 'Open channel flow',
    eq: 'Q = (k/n) A R²ᐟ³ S¹ᐟ²',
    desc: 'Discharge, velocity, or slope for uniform flow in open channels.',
  },
  {
    title: 'Darcy-Weisbach',
    category: 'Pipe flow',
    eq: 'h_f = f (L/D) V²/2g',
    desc: 'Friction head loss using the Moody / Colebrook friction factor.',
  },
  {
    title: 'V-notch weir',
    category: 'Weirs & flumes',
    eq: 'Q = C tan(θ/2) H⁵ᐟ²',
    desc: 'Flow over triangular sharp-crested weirs from measured head.',
  },
  {
    title: 'Hazen-Williams',
    category: 'Pipe flow',
    eq: 'V = k C R⁰·⁶³ S⁰·⁵⁴',
    desc: 'Head loss in water distribution and pressurized pipe networks.',
  },
  {
    title: 'Parshall flume',
    category: 'Weirs & flumes',
    eq: 'Q = C Hₐⁿ',
    desc: 'Free and submerged flow for standard throat widths.',
  },
  {
    title: 'Rational method',
    category: 'Hydrology',
    eq: 'Q = C i A',
    desc: 'Peak runoff for small drainage areas and storm sewer design.',
  },
];
