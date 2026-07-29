const pickDirBtn = document.getElementById('pickDir');
    const fileList = document.getElementById('fileList');

    pickDirBtn.addEventListener('click', async () => {
      try {

        const dirHandle = await window.showDirectoryPicker();

        fileList.innerHTML = ''; 

        
        for await (const [name, handle] of dirHandle.entries()) {
          const li = document.createElement('li');
          li.textContent = `${name} (${handle.kind})`;
          fileList.appendChild(li);
        }
      } catch (err) {
        console.error('Error accessing directory:', err);
        alert('Directory access was cancelled');
      }
    });