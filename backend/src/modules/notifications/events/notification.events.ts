export enum NotificationEvents {
  // Application events
  APPLICATION_SUBMITTED = 'application.submitted',
  APPLICATION_ACCEPTED = 'application.accepted',
  APPLICATION_REJECTED = 'application.rejected',

  // User registration
  USER_REGISTERED = 'user.registered',

  // Job events (for future)
  JOB_CREATED = 'job.created',
  JOB_UPDATED = 'job.updated',
  JOB_DELETED = 'job.deleted',

  // System events
  SYSTEM_NOTIFICATION = 'system.notification',
}

export interface INotification {
  type: NotificationEvents;
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: Date;
}
