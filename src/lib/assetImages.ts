import type { AssetDeviceType } from '../types/network';

export const INFRASTRUCTURE_IMAGES = {
  datacenter: '/src/assets/images/datacenter_rack_hero_1794721134701.jpg',
  noc: '/src/assets/images/noc_operations_room_1794721135919.jpg',
  coreHardware: '/src/assets/images/core_router_hardware_1794721136046.jpg',
  otGateway: '/src/assets/images/industrial_ot_gateway_1794721136964.jpg',
} as const;

export function getHardwareImageForType(deviceType: AssetDeviceType): string {
  switch (deviceType) {
    case 'PLC / OT Controller':
    case 'Gateway':
    case 'Sensor':
    case 'Workstation':
      return INFRASTRUCTURE_IMAGES.otGateway;
    case 'Router':
    case 'Switch':
    case 'Firewall':
    case 'Server':
    default:
      return INFRASTRUCTURE_IMAGES.coreHardware;
  }
}
