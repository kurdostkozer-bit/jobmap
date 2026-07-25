# @jobmap/shared

Shared types, constants, and interfaces between Backend and Frontend.

## Usage

### Backend
```typescript
import { NotificationEventTypes, INotificationPayload, WebSocketEvents } from '@jobmap/shared';

const notification: INotificationPayload = {
  type: NotificationEventTypes.APPLICATION_SUBMITTED,
  title: 'New Application',
  message: 'You have a new job application',
};
```

### Frontend
```typescript
import { NotificationEventTypes, WebSocketEvents, WebSocketConfig } from '@jobmap/shared';

const config = {
  reconnection: WebSocketConfig.RECONNECTION,
  reconnectionDelay: WebSocketConfig.RECONNECTION_DELAY,
};
```

## Contents

- **NotificationEventTypes**: Enum of all notification event types
- **INotificationPayload**: Interface for notification structure
- **INotificationAck**: Interface for acknowledgment responses
- **WebSocketEvents**: Constant object for Socket.IO event names
- **WebSocketConfig**: Configuration for reconnection and heartbeat
