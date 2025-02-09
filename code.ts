figma.showUI(__html__, { width: 784, height: 485 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-notes') {
    try {
      const notes = msg.notes;
      const spacing = 150;
      
      // Load fonts for both Figma and FigJam
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" })
      ]);
      
      if (figma.editorType === 'figma') {
        for (let i = 0; i < notes.length; i++) {
          const note = notes[i];
          
          const sticky = figma.createFrame();
          sticky.fills = [{type: 'SOLID', color: {r: 1, g: 0.8, b: 0.2}}];
          sticky.resize(300, 200);
          
          const text = figma.createText();
          const formattedText = `${note.text}\n\nTime: ${note.timestamp}\nTags: ${note.emojis.join(', ')}`;
          text.characters = formattedText;
          text.textAutoResize = 'HEIGHT';
          text.x = 16;
          text.y = 16;
          text.resize(268, text.height);
          
          sticky.appendChild(text);
          sticky.x = figma.viewport.center.x;
          sticky.y = figma.viewport.center.y + (i * spacing);
        }
      } else if (figma.editorType === 'figjam') {
        for (let i = 0; i < notes.length; i++) {
          const note = notes[i];
          const sticky = figma.createSticky();
          
          const formattedText = `${note.text}\n\nTime: ${note.timestamp}\nTags: ${note.emojis.join(', ')}`;
          sticky.text.characters = formattedText;
          
          sticky.x = figma.viewport.center.x;
          sticky.y = figma.viewport.center.y + (i * spacing);
        }
      }
      
      figma.notify(`Created ${notes.length} ${figma.editorType === 'figma' ? 'frames' : 'stickies'}`);
    } catch (error) {
      console.error('Error details:', error);
      figma.notify('Error: ' + (error as Error).message);
    }
  }
};