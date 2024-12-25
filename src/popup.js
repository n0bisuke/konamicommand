document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('konami').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
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
          if (round >= 3) return;
          
          let currentKey = 0;
          function emitKey() {
            if (currentKey >= sequence.length) {
              console.log(`シーケンス ${round + 1}/3 完了`);
              setTimeout(() => runSequence(round + 1), 1024); // 次のラウンドまで1秒待機
              return;
            }

            const key = sequence[currentKey];
            console.log(`ラウンド ${round + 1}/3: キー入力: ${key} (${currentKey + 1}/${sequence.length})`);

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