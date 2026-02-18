
import { Trip, TripStatus, PipelineStatus, ActivityItem } from './types';

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    clientName: 'Rossi Transporti SpA',
    status: TripStatus.IN_TRANSIT,
    task: {
      id: 'FL-789012',
      pickup: { country: 'FR', zip: '67720', city: 'HOERDT', date: '03.02' },
      delivery: { country: 'DE', zip: '54424', city: 'THALFANG', date: '04.02' },
      distance: 1250
    },
    cmr: {
      status: PipelineStatus.WARNING, // Orange dot
      currentStep: 'Sent_to_Client',
      tag: 'SENT BY EMAIL',
      history: [
        { id: 'c1', label: 'Створено', status: PipelineStatus.COMPLETED },
        { id: 'c2', label: 'Завантажено', status: PipelineStatus.COMPLETED, value: 'cmr_scan.pdf' },
        { id: 'c3', label: 'Надіслано поштою', status: PipelineStatus.WARNING, value: 'logistics@rossi.it' },
      ]
    },
    billing: {
      status: PipelineStatus.PENDING, // Gray dot
      amount: 2450,
      currency: 'EUR',
      invoiceId: 'INV-789012',
      invoiceStatus: 'ISSUED'
    }
  },
  {
    id: '2',
    clientName: 'PolLogistics SA',
    status: TripStatus.COMPLETED,
    task: {
      id: 'FL-123456',
      pickup: { country: 'PL', zip: '05-500', city: 'PIASECZNO', date: '22.05' },
      delivery: { country: 'IT', zip: '80100', city: 'NAPOLI', date: '24.05' },
      distance: 1800
    },
    cmr: {
      status: PipelineStatus.COMPLETED, // Green dot
      currentStep: 'Received',
      tag: 'RECEIVED',
      history: [
        { id: 'c1', label: 'Створено', status: PipelineStatus.COMPLETED },
        { id: 'c2', label: 'Завантажено', status: PipelineStatus.COMPLETED },
        { id: 'c3', label: 'Підтверджено', status: PipelineStatus.COMPLETED, value: 'Підписано клієнтом' }
      ]
    },
    billing: {
      status: PipelineStatus.COMPLETED, // Green dot (implied by completion)
      amount: 1800,
      currency: 'EUR',
      invoiceId: 'INV-123456',
      invoiceStatus: 'PAID'
    }
  },
  {
    id: '3',
    clientName: 'Nordic Freight GmbH',
    status: TripStatus.SCHEDULED,
    task: {
      id: 'FL-998877',
      pickup: { country: 'DE', zip: '20095', city: 'HAMBURG', date: '01.06' },
      delivery: { country: 'UA', zip: '79000', city: 'LVIV', date: '03.06' },
      distance: 1400
    },
    cmr: {
      status: PipelineStatus.PENDING,
      currentStep: 'Drafting',
      history: []
    },
    billing: {
      status: PipelineStatus.BLOCKED,
      amount: 3200,
      currency: 'EUR',
      invoiceStatus: 'WAITING_DOCS'
    }
  }
];

export const MOCK_ACTIVITY_STREAM: ActivityItem[] = [
  {
    id: 'a1',
    type: 'EMAIL',
    date: '2024-02-04T10:30:00',
    author: 'Me',
    title: 'Надіслано документи (CMR, Рахунок)',
    content: 'Доброго дня. В повідомленні прикріпив фактуру та CMR за реалізоване злецення. Прошу підтвердити отримання.',
    meta: { attachments: ['cmr_scan.pdf', 'invoice_789012.pdf'] }
  },
  {
    id: 'a2',
    type: 'SYSTEM',
    date: '2024-02-04T10:29:00',
    author: 'System',
    title: 'Зміна статусу: CMR Надіслано',
    content: 'Статус змінено з "Завантажено" на "Надіслано клієнту"'
  },
  {
    id: 'a3',
    type: 'TASK',
    date: '2024-02-04T09:15:00',
    author: 'Me',
    title: 'Перевірити оригінали',
    content: 'Водій має передати оригінали документів завтра в офісі.',
    isCompleted: false
  },
  {
    id: 'a4',
    type: 'NOTE',
    date: '2024-02-03T16:00:00',
    author: 'Me',
    title: 'Коментар логіста',
    content: '// Клієнт просив надіслати документи на іншу пошту (accounting@rossi.it), але в системі стара адреса. Надіслав на обидві.'
  },
  {
    id: 'a5',
    type: 'DOCUMENT',
    date: '2024-02-03T14:20:00',
    author: 'Driver App',
    title: 'Завантажено CMR',
    meta: { file: 'scan_from_driver_app.jpg' }
  },
  {
    id: 'a6',
    type: 'SYSTEM',
    date: '2024-02-03T08:00:00',
    author: 'System',
    title: 'Рейс розпочато',
    content: 'Статус рейсу змінено на IN_TRANSIT'
  }
];
