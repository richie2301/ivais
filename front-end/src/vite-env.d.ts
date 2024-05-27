/// <reference types="vite/client" />

declare module 'kepler.gl/reducers'
declare module 'kepler.gl/middleware'
declare module 'react-palm/tasks'
declare module 'kepler.gl/actions'
declare module 'kepler.gl'
declare module 'swr'
declare module 'mqtt/dist/mqtt'
declare module 'html2pdf.js'
// declare module 'process'

// mapbox-gl-geocoder.d.ts
declare module '@mapbox/mapbox-gl-geocoder' {
    export default class MapboxGeocoder {
      constructor(options?: any);
      // Add methods and properties as needed
    }
  }