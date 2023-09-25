import { ElMessage, ElMessageBox } from "element-plus";


const success = (info, time = null) => {
    if (time == null) {
        ElMessage({ showClose: true, message: info, type: 'success' });
    }
    else {
        ElMessage({ showClose: true, message: info, type: 'success', duration: time * 1000 });
    }
}

const error = (info, time = null) => {
    if (time == null) {
        ElMessage({ showClose: true, message: info, type: 'error' });
    }
    else {
        ElMessage({ showClose: true, message: info, type: 'error', duration: time * 1000 });
    }
}

const warning = (info, time = null) => {
    if (time == null) {
        ElMessage({ showClose: true, message: info, type: 'warning' });
    }
    else {
        ElMessage({ showClose: true, message: info, type: 'warning', duration: time * 1000 });
    }
}

const info = (info, time = null) => {
    if (time == null) {
        ElMessage({ showClose: true, message: info, type: 'info' });
    }
    else {
        ElMessage({ showClose: true, message: info, type: 'info', duration: time * 1000 });
    }
}
 
const confirm = (msg, func) => {
    ElMessageBox.confirm(msg)
        .then(() => {
            func();
        })
        .catch(() => {
            info('取消操作')
        })
}

const message = {
    success, error, warning, info, confirm
}



export { message }