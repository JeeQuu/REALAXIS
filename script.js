// Audio Context and Setup
let audioContext;
let reverbNode;
let reverbGainNode;
let dryGainNode;
let masterGainNode;

// Zone configurations
const zoneConfigs = [
    { id: 'zone-counter', label: '🎵 Countermelody', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/countermelody_ugl15i.mp3', cursor: 'cursor-coffee' },
    { id: 'zone-diva-01', label: '🎤 Diva 01', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_01_hvzz6h.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-02', label: '🎤 Diva 02', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_02_haafdv.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-03', label: '🎤 Diva 03', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_03_qmqjan.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-04', label: '🎤 Diva 04', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_04_wetsuf.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-05', label: '🎤 Diva 05', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_05_jdthhb.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-06', label: '🎤 Diva 06', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_06_yocajt.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-07', label: '🎤 Diva 07', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_07_jnqpa6.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-08', label: '🎤 Diva 08', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_08_fqepng.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-09', label: '🎤 Diva 09', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_09_an4cpq.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-10', label: '🎤 Diva 10', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804048/diva_lead_dry_10_gcz8o0.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-moog-01', label: '🎸 Moog 01', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/moog_bass_0101_ww9fjw.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-02', label: '🎸 Moog 02', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0102_vahunb.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-03', label: '🎸 Moog 03', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/moog_bass_0103_hyz5p6.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-04', label: '🎸 Moog 04', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0104_tydufl.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-05', label: '🎸 Moog 05', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0105_llghgv.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-noise', label: '💥 Noise Splash', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804048/noise_splash_hm3iz8.mp3', cursor: 'cursor-tennis' }
];

// Loop configurations
const loopConfigs = [
    { id: 'loop-backing', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/MUSIC_BACKING12jun_usq4af.mp3' },
    { id: 'loop-diva', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_DIVA_LEAD12jun_u2rnmr.mp3' },
    { id: 'loop-moog', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_MOOGBASS12jun_odcc25.mp3' },
    { id: 'loop-noise', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_NOISE_COUNTER12jun_iy4smc.mp3' }
];

// State management
const zones = new Map();
const loops = new Map();
const activeAudio = new Map(); // Track active audio per zone
let triggerMode = 'oneshot';
let draggedZone = null;
let resizingZone = null;

// Initialize on start button click
document.getElementById('startButton').addEventListener('click', async () => {
    await initializeAudio();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initializeZones();
    await initializeLoops();
    setupEventListeners();
});

// Initialize Audio Context and Effects
async function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio Context created, state:', audioContext.state);
        
        // Resume context if suspended (common in modern browsers)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log('Audio Context resumed, new state:', audioContext.state);
        }
        
        // Create master gain
        masterGainNode = audioContext.createGain();
        masterGainNode.gain.value = 1.0;
        masterGainNode.connect(audioContext.destination);
        console.log('Master gain node created and connected');
        
        // Create reverb using ConvolverNode
        reverbNode = audioContext.createConvolver();
        
        // Create impulse response for reverb
        const length = audioContext.sampleRate * 2; // 2 second reverb
        const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        reverbNode.buffer = impulse;
        console.log('Reverb impulse response created');
        
        // Create wet/dry mix
        reverbGainNode = audioContext.createGain();
        reverbGainNode.gain.value = 0.3;
        dryGainNode = audioContext.createGain();
        dryGainNode.gain.value = 0.7;
        
        reverbNode.connect(reverbGainNode);
        reverbGainNode.connect(masterGainNode);
        dryGainNode.connect(masterGainNode);
        
        console.log('Audio Context fully initialized:', audioContext.state);
        console.log('Sample rate:', audioContext.sampleRate);
        console.log('Master gain value:', masterGainNode.gain.value);
        
        // Test if audio context is working with a simple test tone
        testAudioContext();
        
    } catch (error) {
        console.error('Failed to initialize audio context:', error);
        alert('Failed to initialize audio system: ' + error.message);
    }
}

// Test function to verify audio context is working
function testAudioContext() {
    try {
        console.log('Testing audio context with simple tone...');
        const oscillator = audioContext.createOscillator();
        const testGain = audioContext.createGain();
        
        oscillator.connect(testGain);
        testGain.connect(masterGainNode);
        
        oscillator.frequency.value = 440; // A4 note
        testGain.gain.value = 0.1; // Low volume
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2); // Very short beep
        
        console.log('Test tone scheduled');
    } catch (error) {
        console.error('Test tone failed:', error);
    }
}

// Create audio buffer source
async function createAudioSource(url, loop = false) {
    try {
        console.log('Loading audio:', url);
        console.log('Audio context state before fetch:', audioContext.state);
        
        const response = await fetch(url);
        console.log('Fetch response status:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('ArrayBuffer loaded, size:', arrayBuffer.byteLength, 'bytes');
        
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Audio decoded - Duration:', audioBuffer.duration, 'seconds, Channels:', audioBuffer.numberOfChannels, 'Sample Rate:', audioBuffer.sampleRate);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0;
        source.connect(gainNode);
        
        console.log('Audio source created successfully for:', url);
        return { source, gainNode, buffer: audioBuffer };
    } catch (error) {
        console.error('Error loading audio:', url, error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Initialize zones
function initializeZones() {
    const cameras = document.querySelectorAll('.camera-screen');
    const template = document.getElementById('zoneTemplate');
    
    zoneConfigs.forEach((config, index) => {
        const zone = template.content.cloneNode(true);
        const zoneElement = zone.querySelector('.detection-zone');
        
        zoneElement.id = config.id;
        zoneElement.querySelector('.zone-label').textContent = config.label;
        
        // Distribute zones across cameras
        const cameraIndex = index % 4;
        const camera = cameras[cameraIndex];
        
        // Position zones in a grid within each camera
        const zonesPerCamera = Math.ceil(zoneConfigs.length / 4);
        const positionInCamera = Math.floor(index / 4);
        
        zoneElement.style.left = `${20 + (positionInCamera % 2) * 150}px`;
        zoneElement.style.top = `${50 + Math.floor(positionInCamera / 2) * 100}px`;
        zoneElement.style.width = '120px';
        zoneElement.style.height = '80px';
        
        camera.appendChild(zoneElement);
        
        // Store zone data
        zones.set(config.id, {
            element: zoneElement,
            config: config,
            camera: cameraIndex + 1
        });
        
        setupZoneInteractions(zoneElement, config);
    });
}

// Initialize loops
async function initializeLoops() {
    console.log('Initializing loops...');
    console.log('Audio context state:', audioContext.state);
    
    for (const config of loopConfigs) {
        const checkbox = document.getElementById(config.id);
        console.log('Processing loop:', config.id, 'checkbox checked:', checkbox.checked);
        
        try {
            const { source, gainNode } = await createAudioSource(config.audio, true);
            gainNode.gain.value = 0.8; // Slightly lower volume for loops
            gainNode.connect(masterGainNode);
            
            console.log('Loop audio loaded:', config.id, 'gain value:', gainNode.gain.value);
            
            loops.set(config.id, {
                source,
                gainNode,
                checkbox,
                config: config,
                isPlaying: checkbox.checked
            });
            
            if (checkbox.checked) {
                console.log('Starting loop immediately:', config.id);
                source.start(0);
                console.log('Loop started:', config.id);
            }
            
            checkbox.addEventListener('change', async (e) => {
                console.log('Loop checkbox changed:', config.id, 'checked:', e.target.checked);
                if (e.target.checked) {
                    await startLoop(config.id);
                } else {
                    stopLoop(config.id);
                }
            });
        } catch (error) {
            console.error(`Failed to load loop ${config.id}:`, error);
            checkbox.disabled = true;
            checkbox.nextElementSibling.style.color = '#666';
            checkbox.nextElementSibling.title = 'Failed to load: ' + error.message;
        }
    }
    
    console.log('Loops initialization complete. Active loops:', loops.size);
}

// Start loop
async function startLoop(loopId) {
    const loop = loops.get(loopId);
    if (!loop) return;
    
    try {
        const { source, gainNode } = await createAudioSource(loop.config.audio, true);
        gainNode.connect(masterGainNode);
        
        // Stop old source if exists
        if (loop.source) {
            loop.source.stop();
        }
        
        loop.source = source;
        loop.gainNode = gainNode;
        source.start(0);
        
        loops.set(loopId, loop);
    } catch (error) {
        console.error(`Failed to start loop ${loopId}:`, error);
    }
}

// Stop loop
function stopLoop(loopId) {
    const loop = loops.get(loopId);
    if (loop && loop.source) {
        loop.source.stop();
    }
}

// Setup zone interactions
function setupZoneInteractions(zoneElement, config) {
    // Simple click for oneshot mode
    zoneElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('zone-resize-handle')) return;
        if (triggerMode === 'oneshot') {
            playZoneSound(config.id);
        }
    });
    
    // Mouse enter/leave for hold mode and cursor
    zoneElement.addEventListener('mouseenter', () => {
        document.body.className = config.cursor;
        if (triggerMode === 'hold') {
            playZoneSound(config.id);
        }
    });
    
    zoneElement.addEventListener('mouseleave', () => {
        document.body.className = '';
        if (triggerMode === 'hold') {
            stopZoneSound(config.id);
        }
    });
    
    // Drag handling
    zoneElement.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('zone-resize-handle')) return;
        draggedZone = zoneElement;
        zoneElement.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    zoneElement.addEventListener('dragend', () => {
        zoneElement.classList.remove('dragging');
        draggedZone = null;
    });
    
    // Resize handling
    const resizeHandle = zoneElement.querySelector('.zone-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        resizingZone = zoneElement;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = zoneElement.offsetWidth;
        const startHeight = zoneElement.offsetHeight;
        
        function handleResize(e) {
            if (!resizingZone) return;
            
            const newWidth = Math.max(100, startWidth + (e.clientX - startX));
            const newHeight = Math.max(60, startHeight + (e.clientY - startY));
            
            resizingZone.style.width = `${newWidth}px`;
            resizingZone.style.height = `${newHeight}px`;
        }
        
        function stopResize() {
            resizingZone = null;
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        }
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    });
}

// Play zone sound
async function playZoneSound(zoneId) {
    const zone = zones.get(zoneId);
    if (!zone) {
        console.error('Zone not found:', zoneId);
        return;
    }
    
    console.log('Playing zone:', zoneId);
    console.log('Audio context state:', audioContext.state);
    console.log('Zone config:', zone.config);
    
    // Stop any existing sound for this zone
    stopZoneSound(zoneId);
    
    try {
        const { source, gainNode } = await createAudioSource(zone.config.audio);
        
        // Set gain to ensure it's audible
        gainNode.gain.value = 1.0;
        console.log('Gain node value set to:', gainNode.gain.value);
        
        // Connect to reverb if needed
        if (zone.config.reverb) {
            // Create a splitter to send to both dry and wet
            gainNode.connect(reverbNode);
            gainNode.connect(dryGainNode);
            console.log('Connected to reverb for zone:', zoneId);
            console.log('Reverb gain:', reverbGainNode.gain.value, 'Dry gain:', dryGainNode.gain.value);
        } else {
            gainNode.connect(masterGainNode);
            console.log('Connected directly to master for zone:', zoneId);
        }
        console.log('Master gain value:', masterGainNode.gain.value);
        
        // Store active audio
        activeAudio.set(zoneId, { source, gainNode });
        
        // Add active class
        zone.element.classList.add('active');
        
        // Start playback
        console.log('Starting playback at time:', audioContext.currentTime);
        source.start(0);
        console.log('Playback started for zone:', zoneId);
        
        // Remove active state when ended
        source.onended = () => {
            console.log('Playback ended for zone:', zoneId);
            zone.element.classList.remove('active');
            activeAudio.delete(zoneId);
        };
    } catch (error) {
        console.error(`Failed to play zone ${zoneId}:`, error);
        zone.element.classList.remove('active');
    }
}

// Stop zone sound
function stopZoneSound(zoneId) {
    const zone = zones.get(zoneId);
    const audio = activeAudio.get(zoneId);
    
    if (audio) {
        // Fade out
        audio.gainNode.gain.setValueAtTime(audio.gainNode.gain.value, audioContext.currentTime);
        audio.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
        
        setTimeout(() => {
            audio.source.stop();
            activeAudio.delete(zoneId);
        }, 200);
    }
    
    if (zone) {
        zone.element.classList.remove('active');
    }
}

// Setup camera drop zones
function setupCameraDropZones() {
    const cameras = document.querySelectorAll('.camera-screen');
    
    cameras.forEach((camera) => {
        camera.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        camera.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedZone) return;
            
            const rect = camera.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update position
            draggedZone.style.left = `${Math.max(0, x - draggedZone.offsetWidth / 2)}px`;
            draggedZone.style.top = `${Math.max(0, y - draggedZone.offsetHeight / 2)}px`;
            
            // Move to new camera
            camera.appendChild(draggedZone);
            
            // Update zone camera reference
            const zoneId = draggedZone.id;
            const zone = zones.get(zoneId);
            if (zone) {
                zone.camera = parseInt(camera.parentElement.dataset.camera);
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    setupCameraDropZones();
    
    // Trigger mode toggle
    document.querySelectorAll('input[name="triggerMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            triggerMode = e.target.value;
            // Stop all sounds when switching modes
            activeAudio.forEach((audio, zoneId) => {
                stopZoneSound(zoneId);
            });
        });
    });
    
    // Reverb controls
    const reverbMixSlider = document.getElementById('reverbMix');
    const reverbMixValue = document.getElementById('reverbMixValue');
    
    reverbMixSlider.addEventListener('input', (e) => {
        const mix = e.target.value / 100;
        reverbGainNode.gain.value = mix;
        dryGainNode.gain.value = 1 - mix;
        reverbMixValue.textContent = `${e.target.value}%`;
    });
    
    // Reverb length control
    const reverbLengthSlider = document.getElementById('reverbLength');
    const reverbLengthValue = document.getElementById('reverbLengthValue');
    
    reverbLengthSlider.addEventListener('input', async (e) => {
        const length = parseFloat(e.target.value);
        reverbLengthValue.textContent = `${length.toFixed(1)}s`;
        
        // Recreate impulse response with new length
        const sampleLength = audioContext.sampleRate * length;
        const impulse = audioContext.createBuffer(2, sampleLength, audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < sampleLength; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sampleLength, 2);
            }
        }
        
        reverbNode.buffer = impulse;
    });
    
    // Tracking lag control (simplified - just updates value)
    const trackingLagSlider = document.getElementById('trackingLag');
    const trackingLagValue = document.getElementById('trackingLagValue');
    
    trackingLagSlider.addEventListener('input', (e) => {
        trackingLagValue.textContent = `${e.target.value}ms`;
    });
    
    // Save/Load layout
    document.getElementById('saveLayout').addEventListener('click', saveLayout);
    document.getElementById('loadLayout').addEventListener('click', loadLayout);
}

// Save layout to localStorage
function saveLayout() {
    const layout = {
        zones: []
    };
    
    zones.forEach((zone, id) => {
        const element = zone.element;
        const camera = element.parentElement.parentElement.dataset.camera;
        
        layout.zones.push({
            id: id,
            camera: camera,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height
        });
    });
    
    localStorage.setItem('quantastical-layout', JSON.stringify(layout));
    
    // Visual feedback
    const button = document.getElementById('saveLayout');
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Load layout from localStorage
function loadLayout() {
    const savedLayout = localStorage.getItem('quantastical-layout');
    if (!savedLayout) {
        alert('No saved layout found');
        return;
    }
    
    const layout = JSON.parse(savedLayout);
    const cameras = document.querySelectorAll('.camera-screen');
    
    layout.zones.forEach(zoneLayout => {
        const zone = zones.get(zoneLayout.id);
        if (!zone) return;
        
        const element = zone.element;
        const targetCamera = cameras[parseInt(zoneLayout.camera) - 1];
        
        if (targetCamera) {
            targetCamera.appendChild(element);
            element.style.left = zoneLayout.left;
            element.style.top = zoneLayout.top;
            element.style.width = zoneLayout.width;
            element.style.height = zoneLayout.height;
            
            zone.camera = parseInt(zoneLayout.camera);
        }
    });
    
    // Visual feedback
    const button = document.getElementById('loadLayout');
    const originalText = button.textContent;
    button.textContent = 'Loaded!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space to toggle trigger mode
    if (e.code === 'Space' && !e.target.matches('input')) {
        e.preventDefault();
        const currentMode = document.querySelector('input[name="triggerMode"]:checked').value;
        const newMode = currentMode === 'oneshot' ? 'hold' : 'oneshot';
        document.getElementById(newMode === 'oneshot' ? 'modeOneShot' : 'modeHold').checked = true;
        triggerMode = newMode;
    }
    
    // Number keys 1-4 to toggle loops
    if (e.code >= 'Digit1' && e.code <= 'Digit4') {
        const index = parseInt(e.code.slice(-1)) - 1;
        const checkbox = document.querySelectorAll('.loop-toggle input')[index];
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
    
    // S to save layout
    if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveLayout();
    }
    
    // L to load layout
    if (e.code === 'KeyL' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        loadLayout();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Ensure zones stay within camera bounds
    zones.forEach(zone => {
        const element = zone.element;
        const camera = element.parentElement;
        if (!camera) return;
        
        const maxX = camera.offsetWidth - element.offsetWidth;
        const maxY = camera.offsetHeight - element.offsetHeight;
        
        const currentX = parseInt(element.style.left) || 0;
        const currentY = parseInt(element.style.top) || 0;
        
        element.style.left = `${Math.min(currentX, Math.max(0, maxX))}px`;
        element.style.top = `${Math.min(currentY, Math.max(0, maxY))}px`;
    });
});

// Audio diagnostic function - call from console: audioDiagnostic()
window.audioDiagnostic = function() {
    console.log('=== AUDIO DIAGNOSTIC ===');
    
    if (!audioContext) {
        console.error('❌ Audio context not initialized');
        return;
    }
    
    console.log('✅ Audio context exists');
    console.log('State:', audioContext.state);
    console.log('Sample rate:', audioContext.sampleRate);
    console.log('Current time:', audioContext.currentTime);
    
    if (!masterGainNode) {
        console.error('❌ Master gain node missing');
        return;
    }
    
    console.log('✅ Master gain node exists');
    console.log('Master gain value:', masterGainNode.gain.value);
    
    console.log('Zones loaded:', zones.size);
    console.log('Loops loaded:', loops.size);
    console.log('Active audio:', activeAudio.size);
    
    // Check if any loops are playing
    loops.forEach((loop, id) => {
        console.log(`Loop ${id}:`, loop.isPlaying ? '▶️ Playing' : '⏹️ Stopped', 'Gain:', loop.gainNode.gain.value);
    });
    
    // Test audio with simple beep
    console.log('Playing test beep...');
    try {
        const oscillator = audioContext.createOscillator();
        const testGain = audioContext.createGain();
        
        oscillator.connect(testGain);
        testGain.connect(masterGainNode);
        
        oscillator.frequency.value = 800;
        testGain.gain.value = 0.1;
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        console.log('✅ Test beep scheduled');
    } catch (error) {
        console.error('❌ Test beep failed:', error);
    }
    
    console.log('=== END DIAGNOSTIC ===');
};