import html2canvas from 'html2canvas';

export const generateInvitationImage = async (elementId: string): Promise<Blob | null> => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    // Wait a bit for any animations or layout changes to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force the element to have the exact dimensions we want
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    
    // Set fixed dimensions to match the reference template
    element.style.width = '350px';
    element.style.height = '700px';
    
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      width: 350,
      height: 700,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 350,
      windowHeight: 700,
      ignoreElements: (element) => {
        // Ignore any elements that might interfere with the capture
        return element.classList.contains('ignore-capture');
      }
    });
    
    // Restore original dimensions
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 1.0);
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

export const shareInvitation = async (guestName: string, tableNumber: string, weddingDetails: any) => {
  // Use the new deployed Netlify domain
  const deployedDomain = 'https://guestlydemo.netlify.app';
  const invitationLink = `${deployedDomain}/invitation?name=${encodeURIComponent(guestName)}&table=${encodeURIComponent(tableNumber)}`;
  
  // Create a personalized WhatsApp message with all invitation details
  const message = `🎉 *Invitation de mariage*

✨ Bonjour ${guestName} !

Vous êtes officiellement invité(e) au mariage de ${weddingDetails.groomName} & ${weddingDetails.brideName}

📅 *${weddingDetails.weddingDate} à ${weddingDetails.ceremonyTime}*
📍 *${weddingDetails.venue}, ${weddingDetails.venueLocation}*
🪑 *Table ${tableNumber}*

👆 *Cliquez sur ce lien pour voir et télécharger votre invitation personnalisée :*
${invitationLink}

Nous avons hâte de célébrer avec vous ! 💕`;

  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  console.log('Generated invitation link:', invitationLink);
  console.log('WhatsApp message:', message);
  
  // Open WhatsApp with the personalized message
  window.open(whatsappUrl, '_blank');
};

export const shareToWhatsApp = async (guestName: string, tableNumber: string, imageBlob?: Blob) => {
  // Use the new deployed Netlify domain
  const deployedDomain = 'https://guestlydemo.netlify.app';
  const invitationLink = `${deployedDomain}/invitation?name=${encodeURIComponent(guestName)}&table=${encodeURIComponent(tableNumber)}`;
  
  // Create a more direct and clickable message for WhatsApp
  const message = `🎉 *Invitation de mariage*

✨ Bonjour ${guestName} !

Vous êtes officiellement invité(e) au mariage de Jack & Sofia

📅 *22 octobre à 10h*
📍 *Sheraton Kauai Resort, Hawaii*
🪑 *Table ${tableNumber}*

👆 *Cliquez sur ce lien pour voir et télécharger votre invitation personnalisée :*
${invitationLink}

Nous avons hâte de célébrer avec vous ! 💕`;
  
  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  console.log('Generated invitation link:', invitationLink);
  console.log('WhatsApp message:', message);
  
  if (imageBlob && navigator.share && navigator.canShare) {
    try {
      const file = new File([imageBlob], `invitation-${guestName.replace(/\s+/g, '-')}.jpeg`, { 
        type: 'image/jpeg' 
      });
      
      // Check if we can share files
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Invitation de mariage',
          text: `Invitation pour ${guestName} - Table ${tableNumber}\n\n${invitationLink}`,
          files: [file]
        });
        return;
      }
    } catch (error) {
      console.log('Native sharing failed, falling back to WhatsApp URL');
    }
  }
  
  // Fallback to WhatsApp URL - this will work on all devices
  window.open(whatsappUrl, '_blank');
};