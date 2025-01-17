import { events } from "bdsx/event";
import { storageManager } from "bdsx/storage";

// global storage
const storage = storageManager.getSync('storage_example');
if (storage.data === undefined) { // it's undefined if it does not exist.
    // initialize
    storage.init({
        a: 1,
        b: '2',
        c: [3,4],
        d: true,
        counter: 0,
    });
}

storage.data.counter++; // it will be saved automatically after 500ms.
console.log(`storage counter = ${storage.data.counter}`);
// the flush delay is defined on 'storageManager.driver.flushDelay' and it can be modified.

// storage from the player
events.playerJoin.on(async(ev)=>{
    const playerName = ev.player.getNameTag();
    const storage = await storageManager.get(ev.player); // it's using an asynchronized method.
    // don't recommend the synchronized method. ex) storageManager.getSync
    // the synchronized method pauses the entire server until the end of the load.
    if (!storage.isLoaded) return; // if the player left before loading it's possible to occur.

    if (storage.data === undefined) {
        // initialize
        storage.init({
            level: 1,
            money: 1000,
            permaInfo: 'Hello World',
            attendance: 0,
            lastLoginDate: new Date().toDateString(),
        });
    }

    const playerData = storage.data;
    const today = new Date().toDateString();
    console.log(`${playerName}.lastLoginDate=${playerData.lastLoginDate}`);
    if (playerData.lastLoginDate !== today) {
        playerData.attendance++;
        playerData.lastLoginDate = today;
    }
    console.log(`${playerName}.attendance=${playerData.attendance}`);

    // storing instance
    const instance = new CustomClass;
    instance.value = 1;
    playerData.object = instance;
    console.assert(playerData.object !== instance); // but it's not referenced object.
    console.assert((playerData.object instanceof CustomClass) === false); // it's not the class instance even.
    console.assert(playerData.object.value === 1); // but the property is stored anyway.
});

events.playerLeft.on(async(ev)=>{
    storageManager.close(ev.player);
});

class CustomClass {
    value:number;
}
