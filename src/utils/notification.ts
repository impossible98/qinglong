import { notification } from 'antd';

function notify(description: string) {
    const args = {
        message: "Notification",
        description: description,
        duration: 2,
    };
    notification.open(args);
}

export default notify;
