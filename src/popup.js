document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('konami').addEventListener('click', async () => {
    const rotations = parseInt(document.getElementById('rotations').value) || 3;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [rotations],  // 回転回数を引数として渡す
      func: (totalRotations) => {
        const sequence = [
          'ArrowUp', 'ArrowUp',
          'ArrowDown', 'ArrowDown',
          'ArrowLeft', 'ArrowRight',
          'ArrowLeft', 'ArrowRight',
          'b', 'a'
        ];
        
        function createKeyEvent(type, key) {
          return new KeyboardEvent(type, {
            key: key,
            code: key.startsWith('Arrow') ? key : `Key${key.toUpperCase()}`,
            keyCode: key === 'a' ? 65 : key === 'b' ? 66 : 
                    key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : 
                    key === 'ArrowLeft' ? 37 : key === 'ArrowRight' ? 39 : 0,
            bubbles: true,
            cancelable: true,
            view: window
          });
        }

        function runSequence(round) {
          if (round >= totalRotations) return;
          
          let currentKey = 0;
          function emitKey() {
            if (currentKey >= sequence.length) {
              console.log(`シーケンス ${round + 1}/${totalRotations} 完了`);
              setTimeout(() => runSequence(round + 1), 1024);
              return;
            }

            const key = sequence[currentKey];
            console.log(`ラウンド ${round + 1}/${totalRotations}: キー入力: ${key} (${currentKey + 1}/${sequence.length})`);

            document.documentElement.dispatchEvent(createKeyEvent('keydown', key));
            document.documentElement.dispatchEvent(createKeyEvent('keypress', key));
            document.documentElement.dispatchEvent(createKeyEvent('keyup', key));

            currentKey++;
            setTimeout(emitKey, 1);
          }

          emitKey();
        }

        runSequence(0);
      }
    });
  });
});