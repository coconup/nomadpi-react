import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nomadpi.app',
  appName: 'nomadpi',
  webDir: 'build',
  server: {
    server: 'http://192.168.1.110:3000',
    // androidScheme: 'https'
    cleartext: true
  }
};

export default config;
