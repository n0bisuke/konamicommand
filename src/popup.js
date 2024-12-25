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
          
          let currentKey = 0;
  
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
  
          function simulateKey() {
            if (currentKey >= sequence.length) {
              console.log('シーケンス完了');
              return;
            }
  
            const key = sequence[currentKey];
            console.log(`キー入力: ${key} (${currentKey + 1}/${sequence.length})`);
  
            // 3つのイベントを順番に送信
            document.documentElement.dispatchEvent(createKeyEvent('keydown', key));
            document.documentElement.dispatchEvent(createKeyEvent('keypress', key));
            document.documentElement.dispatchEvent(createKeyEvent('keyup', key));
  
            currentKey++;
            setTimeout(simulateKey, 50);
          }
  
          simulateKey();
        }
      });
    });
  });