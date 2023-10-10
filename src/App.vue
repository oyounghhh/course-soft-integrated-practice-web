<template>
    <router-view />
</template>

<script>
// ------------------ 解决 ResizeObserver loop completed with undelivered notifications. ------------------
const debounce = (fn, delay) => {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16)
        super(callback)
    }
}
</script>
