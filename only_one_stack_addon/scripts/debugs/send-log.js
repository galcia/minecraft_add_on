import { world } from '@minecraft/server'
/**
 * @description ログとして出力する デバック用
 * @param {String | Int} text 
 * @note integer型で保存されている場合　そのままsendMessageに送っても表示されないため
 *       String型に変換してからメッセージとして送る
 */
export function sendLog(text) {
    world.sendMessage(String(text))
}