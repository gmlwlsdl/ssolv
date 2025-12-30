'use client';

import { useState, useMemo, useCallback } from 'react';

import { MEMBERS_SIZE } from '@/app/meetings/create/_models/constants';
import { getDefaultDateTime } from '@/app/meetings/create/_utils/timeFormat';
import { validateForm } from '@/app/meetings/create/_utils/validate';

import { CreateMeetingFormData, Station } from '../_models/types';

export const INITIAL_FORM_DATA: CreateMeetingFormData = {
  name: '',
  attendeeCount: MEMBERS_SIZE.MIN,
  station: null,
  date: getDefaultDateTime().defaultDate,
  time: getDefaultDateTime().defaultTime,
};

export const useMeetingForm = () => {
  const [formData, setFormData] = useState<CreateMeetingFormData>(INITIAL_FORM_DATA);

  const setName = (name: string) => updateFormData({ name });
  const setMembers = (attendeeCount: number) => updateFormData({ attendeeCount });
  const setStation = (station: Station | null) => updateFormData({ station });
  const setDateTime = (date: string | null, time: string | null) => updateFormData({ date, time });
  const setDate = (date: string | null) => updateFormData({ date });
  const setTime = useCallback((time: string | null) => {
    updateFormData({ time });
  }, []);

  const updateFormData = (updates: Partial<CreateMeetingFormData>) =>
    setFormData((prev: CreateMeetingFormData) => ({ ...prev, ...updates }));

  const isFormValid = useMemo(() => validateForm(formData), [formData]);

  return {
    formData,
    setName,
    setMembers,
    setStation,
    setDateTime,
    setDate,
    setTime,
    isFormValid,
  };
};
