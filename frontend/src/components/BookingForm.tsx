'use client';

import React from 'react';
import { ProcurementBookingForm } from './ProcurementBookingForm';

interface BookingFormProps {
  onBookingSuccess: (data: any) => void;
}

export function BookingForm({ onBookingSuccess }: BookingFormProps) {
  return <ProcurementBookingForm onBookingSuccess={onBookingSuccess} />;
}
