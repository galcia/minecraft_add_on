
import { sendLog } from './debugs/send-log.js'
import { world, ItemStack, PlayerSpawnAfterEvent } from '@minecraft/server';


/** 
 * @description アイテム埋めを飛ばすindex
 * @type {Array}
 * @note プレイヤーインベントリのindex一覧
 *  9   10  11  12  13  14  15  16  17  inventory top
 *  18  19  20  21  22  23  24  25  26  inventory middle
 *  27  28  29  30  31  32  33  34  35  inventory bottom
 *  0   1   2   3   4   5   6   7   8   hotbar  
 *  */
const FIXED_SLOT_INDEX = [4]

/** 
 * @name FILL_ITEM
 * @type {ItemStack}
 * @note 埋めるアイテムを指定 minecraft wikiのアイテム項目に書かれてるID等を参照
 */
const FILL_ITEM = new ItemStack("minecraft:barrier")



// 初期化
fillItemAllPlayerSlot()

// 1箇所除いてバリアブロックで埋める
fillItemAllPlayerSlot(FILL_ITEM, FIXED_SLOT_INDEX)



// チートの実行をONの状態で/reloadコマンドを行うと上からここまでの関数が呼ばれる


// TODO マルチ動作未確認

// TODO アイテムの移動が出来てしまうのでどうすればロックできるか調査
//     ⇛ロック情報がプログラムで上書きできないっぽいのでバリアブロック流用して新アイテムを追加し
//      新アイテムの設定jsonでアイテムロックを入れるとよさそう？
//      https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemstack#properties
//      ↑のproperties内ItemLockModeオプションがslotに設定されればいけるはず

// TODO 現在このプログラムが呼ばれるタイミングが/reloadコマンドの時のみ
//      簡単なのはIntervalで呼び続ける⇛負荷的にどうなのか不明
//      一番良いのはプレイヤーがスポーン/リスポーンした時に呼ばれるイベントリスナーを探してそこで呼ばせる

// 以下関数定義

/** 
 * @name fillItemAllPlayerSlot
 * @description 全プレイヤーのインベントリをfillItemで埋める
 * @param {ItemStack} fillItem 埋めるアイテム
 * @param {Array} skipSlots スキップしたいインベントリのindexを纏めたarray
 * @example fillItemAllPlayerSlot() ⇛全プレイヤーの所持アイテムを空にする
 * @example fillItemAllPlayerSlot(null, [1,8]) ⇛ 全プレイヤーの1と8スロットを除いて空にする
 * @example fillItemAllPlayerSlot(new ItemStack("minecraft:barrier"), [4]) ⇛ 全プレイヤーの4スロットを除いてバリアブロックで埋める
 * 
 */
function fillItemAllPlayerSlot(fillItem = null, skipSlots = []) {
    // ワールドに存在する全プレイヤー情報を取得
    let players = world.getPlayers()

    // 全プレイヤーに対して処理を実行
    for (const player of players) {
        fillItemPlayerSlot(player, fillItem, skipSlots)
    }
}

/**
 * @description 特定のプレイヤーのインベントリをfillItemで埋める
 * @param {Player} player 
 * @param {ItemStack} fillItem 
 * @param {Array} skipSlots 
 */
function fillItemPlayerSlot(player, fillItem = null, skipSlots = []) {
    // 対象のプレイヤーのインベントリコンポーネントを取得
    let inventory = player.getComponent("minecraft:inventory")

    // アイテム所持の実体を取得
    let playerItemSlot = inventory.container

    // 全アイテムスロットに対して処理
    for (let i = 0; i < playerItemSlot.size; i++) {
        // skipSlotsで指定されたインデックスのみ処理を飛ばす
        if (skipSlots.length == 0 || skipSlots.find(skip_index => { return skip_index != i })) {
            // i番目のアイテムスロットに指定したアイテムをセット
            if (fillItem == 'null') {
                playerItemSlot.setItem()
            } else {
                playerItemSlot.setItem(i, fillItem);
            }

        } else {
            sendLog(`${i}番目のインベントリをスキップします`)
        }

    }

    /**
     * @name fillItemName
     * @description 最後のログで表示する用の名前
     * @type {String}
     */
    let fillItemName
    if (fillItem) { // null(アイテム指定なし)でなければアイテム名を取得
        fillItemName = fillItem.typeId.split(':')[1]
    } else { // nullならairをセット
        fillItemName = 'air'
    }
    sendLog(`${player.name}のインベントリを${fillItemName}で埋めました`)
}



