// Audio Context and Setup
let audioContext;
let reverbNode;
let reverbGainNode;
let dryGainNode;
let masterGainNode;

// Camera object assignments - easily changeable for performance development
const cameraObjects = {
    1: 'coffee',        // Camera 1: Coffee mug
    2: 'extinguisher',  // Camera 2: Fire extinguisher  
    3: 'tennis',        // Camera 3: Tennis ball
    4: 'coffee'         // Camera 4: Coffee mug (changeable)
};

// Object silhouettes for backgrounds
const objectSilhouettes = {
    coffee: `<svg viewBox="0 0 100 100" class="camera-silhouette">
        <path d="M20 30 L20 70 Q20 80 30 80 L60 80 Q70 80 70 70 L70 50 Q80 50 80 40 L80 35 Q80 30 70 30 L70 35 L70 30 L20 30 Z" fill="rgba(139, 69, 19, 0.1)"/>
        <path d="M25 35 L65 35 L65 65 Q65 70 60 70 L30 70 Q25 70 25 65 Z" fill="rgba(139, 69, 19, 0.05)"/>
    </svg>`,
    extinguisher: `<svg viewBox="0 0 100 100" class="camera-silhouette">
        <rect x="35" y="20" width="30" height="60" rx="15" fill="rgba(220, 38, 38, 0.1)"/>
        <rect x="30" y="15" width="40" height="10" rx="5" fill="rgba(220, 38, 38, 0.08)"/>
        <circle cx="50" cy="30" r="8" fill="rgba(220, 38, 38, 0.12)"/>
        <rect x="47" y="35" width="6" height="35" fill="rgba(220, 38, 38, 0.06)"/>
    </svg>`,
    tennis: `<svg viewBox="0 0 100 100" class="camera-silhouette">
        <circle cx="50" cy="50" r="35" fill="rgba(34, 197, 94, 0.1)"/>
        <path d="M15 50 Q50 30 85 50 Q50 70 15 50" stroke="rgba(34, 197, 94, 0.08)" stroke-width="2" fill="none"/>
        <path d="M50 15 Q30 50 50 85 Q70 50 50 15" stroke="rgba(34, 197, 94, 0.08)" stroke-width="2" fill="none"/>
    </svg>`
};

// Zone configurations - Monica ruff defaults (all hold mode, no sunflower)
const zoneConfigs = [
    { id: 'zone-counter', label: 'Countermelody', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/countermelody_ugl15i.mp3', cursor: 'cursor-coffee', mode: 'hold' },
    { id: 'zone-diva-01', label: 'Diva 01', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_01_hvzz6h.mp3', cursor: 'cursor-coffee', reverb: true, mode: 'hold' },
    { id: 'zone-diva-02', label: 'Diva 02', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_02_haafdv.mp3', cursor: 'cursor-coffee', reverb: true, mode: 'hold' },
    { id: 'zone-diva-03', label: 'Diva 03', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_03_qmqjan.mp3', cursor: 'cursor-coffee', reverb: true, mode: 'hold' },
    { id: 'zone-diva-04', label: 'Diva 04', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_04_wetsuf.mp3', cursor: 'cursor-extinguisher', reverb: true, mode: 'hold' },
    { id: 'zone-diva-05', label: 'Diva 05', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_05_jdthhb.mp3', cursor: 'cursor-extinguisher', reverb: true, mode: 'hold' },
    { id: 'zone-diva-06', label: 'Diva 06', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_06_yocajt.mp3', cursor: 'cursor-coffee', reverb: true, mode: 'hold' },
    { id: 'zone-diva-07', label: 'Diva 07', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804049/diva_lead_dry_07_jnqpa6.mp3', cursor: 'cursor-extinguisher', reverb: true, mode: 'hold' },
    { id: 'zone-diva-08', label: 'Diva 08', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_08_fqepng.mp3', cursor: 'cursor-coffee', reverb: true, mode: 'hold' },
    { id: 'zone-diva-09', label: 'Diva 09', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/diva_lead_dry_09_an4cpq.mp3', cursor: 'cursor-extinguisher', reverb: true, mode: 'hold' },
    { id: 'zone-diva-10', label: 'Diva 10', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804048/diva_lead_dry_10_gcz8o0.mp3', cursor: 'cursor-extinguisher', reverb: true, mode: 'hold' },
    { id: 'zone-moog-01', label: 'Moog 01', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/moog_bass_0101_ww9fjw.mp3', cursor: 'cursor-tennis', mode: 'hold' },
    { id: 'zone-moog-02', label: 'Moog 02', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0102_vahunb.mp3', cursor: 'cursor-tennis', mode: 'hold' },
    { id: 'zone-moog-03', label: 'Moog 03', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804050/moog_bass_0103_hyz5p6.mp3', cursor: 'cursor-tennis', mode: 'hold' },
    { id: 'zone-moog-04', label: 'Moog 04', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0104_tydufl.mp3', cursor: 'cursor-tennis', mode: 'hold' },
    { id: 'zone-moog-05', label: 'Moog 05', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804051/moog_bass_0105_llghgv.mp3', cursor: 'cursor-tennis', mode: 'hold' },
    { id: 'zone-noise', label: 'Noise Splash', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804048/noise_splash_hm3iz8.mp3', cursor: 'cursor-coffee', mode: 'hold' }
];

// Loop configurations
const loopConfigs = [
    { id: 'loop-backing', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/MUSIC_BACKING12jun_usq4af.mp3' },
    { id: 'loop-diva', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_DIVA_LEAD12jun_u2rnmr.mp3' },
    { id: 'loop-moog', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_MOOGBASS12jun_odcc25.mp3' },
    { id: 'loop-noise', audio: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1749804029/STEM_NOISE_COUNTER12jun_iy4smc.mp3' }
];

// Layer system configuration
const layerConfig = {
    backing: {
        loops: ['loop-backing'],
        zones: []
    },
    diva: {
        loops: ['loop-diva'],
        zones: ['zone-diva-01', 'zone-diva-02', 'zone-diva-03', 'zone-diva-04', 'zone-diva-05', 
                'zone-diva-06', 'zone-diva-07', 'zone-diva-08', 'zone-diva-09', 'zone-diva-10']
    },
    moog: {
        loops: ['loop-moog'],
        zones: ['zone-moog-01', 'zone-moog-02', 'zone-moog-03', 'zone-moog-04', 'zone-moog-05']
    },
    noise: {
        loops: ['loop-noise'],
        zones: ['zone-counter', 'zone-noise']
    }
};

// Layer state management with Monica ruff defaults
const layerState = {
    backing: { volume: 0.5, mono: false }, // Lower backing like Monica setup
    diva: { volume: 0.8, mono: false }, // Poly mode for layering
    moog: { volume: 0.8, mono: false }, // Poly mode for rich bass
    noise: { volume: 0.8, mono: false } // Poly for textures
};

// State management
const zones = new Map();
const loops = new Map();
const activeAudio = new Map(); // Track active audio per zone
const activeZonesByLayer = new Map(); // Track active zones per layer for mono mode
let triggerMode = 'hold'; // Default to hold mode like Monica setup
let releaseTime = 350; // Monica's release time
let chokeTime = 20; // Monica's choke time
let draggedZone = null;
let resizingZone = null;

// Initialize layer tracking
Object.keys(layerConfig).forEach(layer => {
    activeZonesByLayer.set(layer, new Set());
});

// Monica's default zone layout - auto-loaded on startup
const monicaDefaultLayout = {
    "zones": [
        { "id": "zone-counter", "camera": "4", "left": "478.5px", "top": "123px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-01", "camera": "1", "left": "712px", "top": "57px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-02", "camera": "1", "left": "376px", "top": "50px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-03", "camera": "1", "left": "65px", "top": "67px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-04", "camera": "2", "left": "526.5px", "top": "242px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-05", "camera": "2", "left": "301.5px", "top": "40px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-06", "camera": "1", "left": "601px", "top": "239px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-07", "camera": "2", "left": "136.5px", "top": "242px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-08", "camera": "1", "left": "254px", "top": "247px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-09", "camera": "2", "left": "591.5px", "top": "38px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-diva-10", "camera": "2", "left": "68.5px", "top": "42px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-moog-01", "camera": "3", "left": "752px", "top": "251px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-moog-02", "camera": "3", "left": "758px", "top": "32px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-moog-03", "camera": "3", "left": "404px", "top": "35px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-moog-04", "camera": "3", "left": "54px", "top": "47px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-moog-05", "camera": "3", "left": "48px", "top": "259px", "width": "120px", "height": "80px", "mode": "hold" },
        { "id": "zone-noise", "camera": "4", "left": "248.5px", "top": "123px", "width": "120px", "height": "80px", "mode": "hold" }
    ],
    "cameraObjects": {
        "1": "coffee",
        "2": "extinguisher", 
        "3": "tennis",
        "4": "coffee"
    }
};

// Initialize on start button click
document.getElementById('startButton').addEventListener('click', async () => {
    try {
        await initializeAudio();
        
        // Extra Safari-specific handling
        if (audioContext.state === 'suspended') {
            console.log('Audio context still suspended after init, trying to resume...');
            await audioContext.resume();
        }
        
        // Ensure audio context is running
        if (audioContext.state !== 'running') {
            console.error('Audio context failed to start:', audioContext.state);
            alert('Audio system failed to initialize. Please try refreshing the page.');
            return;
        }
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        initializeCameraSilhouettes(); // Add silhouettes first
        initializeZones();
        
        // Auto-load Monica's default layout positions
        setTimeout(() => {
            loadLayoutFromData(monicaDefaultLayout);
            console.log('Monica default layout positions loaded');
        }, 100); // Small delay to ensure zones are created first
        
        await initializeLoops();
        setupEventListeners();
        setupCameraObjectControls(); // Add object control listeners
        
        console.log('Application fully initialized!');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert('Failed to start application: ' + error.message);
    }
});

// Add additional user interaction handlers for Safari
document.addEventListener('click', async () => {
    if (audioContext && audioContext.state === 'suspended') {
        console.log('Resuming audio context on user interaction...');
        await audioContext.resume();
    }
});

document.addEventListener('touchstart', async () => {
    if (audioContext && audioContext.state === 'suspended') {
        console.log('Resuming audio context on touch...');
        await audioContext.resume();
    }
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
        
        // Store zone data with individual mode first
        zones.set(config.id, {
            element: zoneElement,
            config: config,
            camera: cameraIndex + 1,
            mode: config.mode // Individual zone mode
        });
        
        setupZoneInteractions(zoneElement, config);
    });
}

// Initialize camera background silhouettes
function initializeCameraSilhouettes() {
    const cameras = document.querySelectorAll('.camera-screen');
    
    cameras.forEach((camera, index) => {
        const cameraNumber = index + 1;
        const objectType = cameraObjects[cameraNumber];
        
        if (objectType && objectSilhouettes[objectType]) {
            // Create silhouette container
            const silhouetteContainer = document.createElement('div');
            silhouetteContainer.className = 'camera-silhouette-container';
            silhouetteContainer.innerHTML = objectSilhouettes[objectType];
            
            // Insert as first child so it appears behind zones
            camera.insertBefore(silhouetteContainer, camera.firstChild);
            
            console.log(`Camera ${cameraNumber} initialized with ${objectType} silhouette`);
        }
    });
}

// Initialize loops - all start simultaneously for perfect sync
async function initializeLoops() {
    console.log('Initializing synchronized loops...');
    console.log('Audio context state:', audioContext.state);
    
    // Load all loops first without starting them
    const loadedLoops = [];
    
    for (const config of loopConfigs) {
        const checkbox = document.getElementById(config.id);
        const layer = getLayerForLoop(config.id);
        
        console.log('Loading loop:', config.id, 'checkbox checked:', checkbox.checked, 'layer:', layer);
        
        try {
            const { source, gainNode } = await createAudioSource(config.audio, true);
            
            // Apply layer volume if layer exists
            if (layer) {
                gainNode.gain.value = layerState[layer].volume;
                console.log('Applied layer volume:', layerState[layer].volume, 'to loop:', config.id);
            } else {
                gainNode.gain.value = 0.8; // Default for loops without layers
            }
            
            // Create mute gain node for this loop
            const muteGainNode = audioContext.createGain();
            muteGainNode.gain.value = checkbox.checked ? 1.0 : 0.0; // Start muted if unchecked
            
            // Connect: source -> gainNode -> muteGainNode -> master
            source.connect(gainNode);
            gainNode.connect(muteGainNode);
            muteGainNode.connect(masterGainNode);
            
            console.log('Loop loaded:', config.id, 'volume:', gainNode.gain.value, 'muted:', !checkbox.checked);
            
            const loopData = {
                source,
                gainNode,
                muteGainNode, // New mute control
                checkbox,
                config: config,
                layer: layer,
                isPlaying: true, // Always playing, just muted/unmuted
                isMuted: !checkbox.checked
            };
            
            loops.set(config.id, loopData);
            loadedLoops.push(loopData);
            
            // Set up mute/unmute toggle instead of start/stop
            checkbox.addEventListener('change', (e) => {
                console.log('Loop mute toggle:', config.id, 'muted:', !e.target.checked);
                toggleLoopMute(config.id, !e.target.checked);
            });
            
        } catch (error) {
            console.error(`Failed to load loop ${config.id}:`, error);
            checkbox.disabled = true;
            checkbox.nextElementSibling.style.color = '#666';
            checkbox.nextElementSibling.title = 'Failed to load: ' + error.message;
        }
    }
    
    // Start ALL loops simultaneously for perfect sync
    console.log('Starting all loops simultaneously for perfect sync...');
    const startTime = audioContext.currentTime + 0.1; // Small delay to ensure everything is ready
    
    loadedLoops.forEach(loopData => {
        loopData.source.start(startTime);
        console.log('Scheduled loop start:', loopData.config.id, 'at time:', startTime);
    });
    
    console.log('All loops initialized and synchronized. Active loops:', loops.size);
}

// Toggle loop mute (keeps loops synchronized)
function toggleLoopMute(loopId, shouldMute) {
    const loop = loops.get(loopId);
    if (!loop || !loop.muteGainNode) return;
    
    const fadeTime = 0.05; // 50ms smooth fade for mute/unmute
    const currentTime = audioContext.currentTime;
    
    console.log(`${shouldMute ? 'Muting' : 'Unmuting'} loop:`, loopId);
    
    // Smooth fade to avoid clicks
    loop.muteGainNode.gain.setValueAtTime(loop.muteGainNode.gain.value, currentTime);
    loop.muteGainNode.gain.linearRampToValueAtTime(shouldMute ? 0.0 : 1.0, currentTime + fadeTime);
    
    loop.isMuted = shouldMute;
}

// Setup zone interactions
function setupZoneInteractions(zoneElement, config) {
    // Set up mode toggle button - get zone after it's been stored
    const modeToggle = zoneElement.querySelector('.zone-mode-toggle');
    
    // Initialize the toggle appearance
    updateZoneModeToggle(modeToggle, config.mode);
    
    modeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Get the zone from the Map (now it should exist)
        const zone = zones.get(config.id);
        if (!zone) {
            console.error('Zone not found in Map:', config.id);
            return;
        }
        
        // Toggle mode
        zone.mode = zone.mode === 'trigger' ? 'hold' : 'trigger';
        updateZoneModeToggle(modeToggle, zone.mode);
        
        console.log(`Zone ${config.id} mode changed to:`, zone.mode);
        
        // Stop any currently playing sound when switching modes
        stopZoneSound(config.id);
    });
    
    // Mouse enter - both modes trigger on hover
    zoneElement.addEventListener('mouseenter', (e) => {
        const zone = zones.get(config.id); // Get fresh zone data
        const currentMode = zone ? zone.mode : config.mode; // Fallback to config if zone not found
        console.log('Zone mouseenter:', config.id, 'Mode:', currentMode);
        
        // Change cursor for entire zone
        document.body.className = config.cursor;
        
        // Play sound in both modes on hover
        playZoneSound(config.id);
    });
    
    // Mouse leave - different behavior based on individual zone mode
    zoneElement.addEventListener('mouseleave', (e) => {
        const zone = zones.get(config.id); // Get fresh zone data
        const currentMode = zone ? zone.mode : config.mode; // Fallback to config if zone not found
        console.log('Zone mouseleave:', config.id, 'Mode:', currentMode);
        
        // Reset cursor
        document.body.className = '';
        
        // Only stop sound in hold mode
        if (currentMode === 'hold') {
            stopZoneSound(config.id);
        }
        // In trigger mode, let the sound play to completion
    });
    
    // Prevent label from interfering with zone interactions
    const zoneLabel = zoneElement.querySelector('.zone-label');
    zoneLabel.style.pointerEvents = 'none';
    
    // Drag handling
    zoneElement.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('zone-resize-handle') || e.target.classList.contains('zone-mode-toggle')) return;
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

// Update zone mode toggle appearance
function updateZoneModeToggle(toggle, mode) {
    if (mode === 'hold') {
        toggle.textContent = 'H';
        toggle.classList.add('hold-mode');
        toggle.title = 'Hold mode: plays while hovering. Click to switch to Trigger mode.';
    } else {
        toggle.textContent = 'T';
        toggle.classList.remove('hold-mode');
        toggle.title = 'Trigger mode: plays to end when triggered. Click to switch to Hold mode.';
    }
}

// Play zone sound
async function playZoneSound(zoneId) {
    const zone = zones.get(zoneId);
    if (!zone) {
        console.error('Zone not found:', zoneId);
        return;
    }
    
    const layer = getLayerForZone(zoneId);
    if (!layer) {
        console.error('Layer not found for zone:', zoneId);
        return;
    }
    
    const currentMode = zone.mode; // Use individual zone mode
    
    console.log('Playing zone:', zoneId, 'in layer:', layer);
    console.log('Audio context state:', audioContext.state);
    console.log('Zone config:', zone.config);
    console.log('Zone mode:', currentMode);
    console.log('Layer state:', layerState[layer]);
    
    // In trigger mode, don't restart if already playing
    if (currentMode === 'trigger' && activeAudio.has(zoneId)) {
        console.log('Zone already playing in trigger mode, ignoring:', zoneId);
        return;
    }
    
    // Handle mono mode - choke other sounds in the same layer
    if (layerState[layer].mono) {
        const activeZonesInLayer = activeZonesByLayer.get(layer);
        for (const activeZoneId of activeZonesInLayer) {
            if (activeZoneId !== zoneId) {
                console.log('Mono mode: choking', activeZoneId, 'to play', zoneId);
                chokeZoneSound(activeZoneId, 'monophonic choke');
            }
        }
    }
    
    // Stop any existing sound for this zone (important for hold mode)
    stopZoneSound(zoneId);
    
    // Add to layer tracking immediately to ensure proper choke ordering
    activeZonesByLayer.get(layer).add(zoneId);
    
    try {
        const { source, gainNode } = await createAudioSource(zone.config.audio);
        
        // Apply layer volume
        const layerVolume = layerState[layer].volume;
        gainNode.gain.value = layerVolume;
        console.log('Applied layer volume:', layerVolume, 'to zone:', zoneId);
        
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
        activeAudio.set(zoneId, { source, gainNode, layer });
        
        // Add active class
        zone.element.classList.add('active');
        
        // Start playback
        console.log('Starting playback at time:', audioContext.currentTime);
        source.start(0);
        console.log('Playback started for zone:', zoneId);
        
        // Remove active state when ended (for both modes)
        source.onended = () => {
            console.log('Playback ended for zone:', zoneId);
            zone.element.classList.remove('active');
            activeAudio.delete(zoneId);
            activeZonesByLayer.get(layer).delete(zoneId);
        };
    } catch (error) {
        console.error(`Failed to play zone ${zoneId}:`, error);
        zone.element.classList.remove('active');
    }
}

// Choke zone sound (for monophonic groups) - faster, smoother fade
function chokeZoneSound(zoneId, reason = 'choke') {
    const zone = zones.get(zoneId);
    const audio = activeAudio.get(zoneId);
    
    if (audio) {
        // Use shorter choke time for musical choke groups
        const fadeTime = chokeTime / 1000; // Convert to seconds
        
        console.log(`Choking zone ${zoneId} (${reason}) with ${fadeTime}s fade`);
        
        // Add visual choking indicator
        if (zone) {
            zone.element.classList.add('choking');
        }
        
        // Fast, smooth fade out
        audio.gainNode.gain.setValueAtTime(audio.gainNode.gain.value, audioContext.currentTime);
        audio.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + fadeTime); // Exponential for more natural sound
        
        // Stop source after fade
        setTimeout(() => {
            try {
                audio.source.stop();
                activeAudio.delete(zoneId);
                
                // Clean up layer tracking
                if (audio.layer) {
                    activeZonesByLayer.get(audio.layer).delete(zoneId);
                }
            } catch (error) {
                // Source might already be stopped, ignore error
                console.log('Source already stopped during choke:', zoneId);
            }
        }, chokeTime);
    }
    
    if (zone) {
        // Remove visual states after choke
        setTimeout(() => {
            zone.element.classList.remove('active');
            zone.element.classList.remove('choking');
        }, chokeTime);
    }
}

// Stop zone sound
function stopZoneSound(zoneId) {
    const zone = zones.get(zoneId);
    const audio = activeAudio.get(zoneId);
    
    if (audio) {
        // Create smooth fade out based on release time
        const fadeTime = releaseTime / 1000; // Convert to seconds
        
        console.log(`Stopping zone ${zoneId} with ${fadeTime}s release`);
        
        // Fade out
        audio.gainNode.gain.setValueAtTime(audio.gainNode.gain.value, audioContext.currentTime);
        audio.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeTime);
        
        setTimeout(() => {
            try {
                audio.source.stop();
                activeAudio.delete(zoneId);
                
                // Clean up layer tracking
                if (audio.layer) {
                    activeZonesByLayer.get(audio.layer).delete(zoneId);
                }
            } catch (error) {
                // Source might already be stopped, ignore error
                console.log('Source already stopped:', zoneId);
            }
        }, releaseTime);
    }
    
    if (zone) {
        // Remove active class after release time
        setTimeout(() => {
            zone.element.classList.remove('active');
        }, releaseTime);
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
    
    // Layer "Set All" mode buttons
    document.querySelectorAll('.set-mode-btn').forEach(button => {
        button.addEventListener('click', () => {
            const layerName = button.dataset.layer;
            const mode = button.dataset.mode;
            
            console.log(`Setting all ${layerName} zones to ${mode} mode`);
            
            // Get zones for this layer
            const layerZones = layerConfig[layerName].zones;
            
            // Update all zones in this layer
            layerZones.forEach(zoneId => {
                const zone = zones.get(zoneId);
                if (zone) {
                    zone.mode = mode;
                    const modeToggle = zone.element.querySelector('.zone-mode-toggle');
                    if (modeToggle) {
                        updateZoneModeToggle(modeToggle, mode);
                    }
                    
                    // Stop any currently playing sound when switching modes
                    stopZoneSound(zoneId);
                }
            });
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = '✓ Set!';
            button.style.backgroundColor = mode === 'trigger' ? '#2563eb' : '#22c55e';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1500);
        });
    });
    
    // Release time control
    const releaseTimeSlider = document.getElementById('releaseTime');
    const releaseTimeValue = document.getElementById('releaseTimeValue');
    
    releaseTimeSlider.addEventListener('input', (e) => {
        releaseTime = parseInt(e.target.value);
        releaseTimeValue.textContent = `${releaseTime}ms`;
        console.log('Release time set to:', releaseTime, 'ms');
    });
    
    // Choke time control
    const chokeTimeSlider = document.getElementById('chokeTime');
    const chokeTimeValue = document.getElementById('chokeTimeValue');
    
    chokeTimeSlider.addEventListener('input', (e) => {
        chokeTime = parseInt(e.target.value);
        chokeTimeValue.textContent = `${chokeTime}ms`;
        console.log('Choke time set to:', chokeTime, 'ms');
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
    
    // Download/Upload layout
    document.getElementById('downloadLayout').addEventListener('click', downloadLayout);
    document.getElementById('uploadLayout').addEventListener('click', uploadLayout);
    document.getElementById('layoutFileInput').addEventListener('change', handleLayoutFileUpload);
    
    // Layer volume controls
    ['backing', 'diva', 'moog', 'noise'].forEach(layerName => {
        // Volume slider
        const volumeSlider = document.getElementById(`volume-${layerName}`);
        const volumeValue = document.getElementById(`volume-${layerName}-value`);
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            layerState[layerName].volume = volume;
            volumeValue.textContent = `${e.target.value}%`;
            
            console.log(`${layerName} layer volume set to:`, volume);
            
            // Update all active audio in this layer
            updateLayerVolume(layerName, volume);
        });
        
        // Mono/poly toggle (skip backing as it doesn't have zones)
        if (layerName !== 'backing') {
            const monoToggle = document.getElementById(`mono-${layerName}`);
            monoToggle.addEventListener('change', (e) => {
                layerState[layerName].mono = e.target.checked;
                console.log(`${layerName} layer mono mode:`, e.target.checked);
                
                // If switching to mono and multiple zones are active, choke all but the most recent
                if (e.target.checked) {
                    const activeZones = Array.from(activeZonesByLayer.get(layerName));
                    if (activeZones.length > 1) {
                        // Keep the most recently triggered zone (last in array)
                        const keepZone = activeZones[activeZones.length - 1];
                        activeZones.slice(0, -1).forEach(zoneId => {
                            console.log('Mono toggle: choking', zoneId, 'keeping', keepZone);
                            chokeZoneSound(zoneId, 'mono mode enabled');
                        });
                    }
                }
            });
        }
    });
}

// Download layout as JSON file
function downloadLayout() {
    const layout = {
        zones: [],
        layers: {},
        version: "1.0",
        timestamp: new Date().toISOString(),
        name: "Quantastical Layout",
        triggerMode: triggerMode,
        releaseTime: releaseTime,
        chokeTime: chokeTime,
        cameraObjects: { ...cameraObjects }
    };
    
    // Save zone positions and modes
    zones.forEach((zone, id) => {
        const element = zone.element;
        const camera = element.parentElement.parentElement.dataset.camera;
        
        layout.zones.push({
            id: id,
            camera: camera,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height,
            mode: zone.mode // Save individual zone mode
        });
    });
    
    // Save layer settings and loop states
    Object.keys(layerState).forEach(layerName => {
        layout.layers[layerName] = {
            volume: layerState[layerName].volume,
            mono: layerState[layerName].mono
        };
    });
    
    // Save loop mute states
    layout.loops = {};
    loops.forEach((loop, loopId) => {
        layout.loops[loopId] = {
            muted: loop.isMuted
        };
    });
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `quantastical-layout-${timestamp}.json`;
    
    // Create and download file
    const dataStr = JSON.stringify(layout, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    
    console.log('Layout downloaded:', filename, layout);
    
    // Visual feedback
    const button = document.getElementById('downloadLayout');
    const originalText = button.textContent;
    button.textContent = '✅ Downloaded!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Upload and load layout from JSON file
function uploadLayout() {
    const fileInput = document.getElementById('layoutFileInput');
    fileInput.click();
}

// Handle file upload
function handleLayoutFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const layout = JSON.parse(e.target.result);
            loadLayoutFromData(layout);
        } catch (error) {
            console.error('Error parsing layout file:', error);
            alert('Error loading layout file. Please check the file format.');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Load layout from data object
function loadLayoutFromData(layout) {
    const cameras = document.querySelectorAll('.camera-screen');
    
    console.log('Loading layout from file:', layout);
    
    // Validate layout version (for future compatibility)
    if (layout.version && layout.version !== "1.0") {
        console.warn('Layout version mismatch. This may cause issues.');
    }
    
    // Load zone positions and modes
    if (layout.zones) {
        layout.zones.forEach(zoneLayout => {
            const zone = zones.get(zoneLayout.id);
            if (!zone) {
                console.warn('Zone not found:', zoneLayout.id);
                return;
            }
            
            const element = zone.element;
            const targetCamera = cameras[parseInt(zoneLayout.camera) - 1];
            
            if (targetCamera) {
                targetCamera.appendChild(element);
                element.style.left = zoneLayout.left;
                element.style.top = zoneLayout.top;
                element.style.width = zoneLayout.width;
                element.style.height = zoneLayout.height;
                
                zone.camera = parseInt(zoneLayout.camera);
                
                // Restore individual zone mode
                if (zoneLayout.mode) {
                    zone.mode = zoneLayout.mode;
                    const modeToggle = element.querySelector('.zone-mode-toggle');
                    if (modeToggle) {
                        updateZoneModeToggle(modeToggle, zone.mode);
                    }
                }
            }
        });
    }
    
    // Load layer settings
    if (layout.layers) {
        Object.keys(layout.layers).forEach(layerName => {
            if (!layerState[layerName]) {
                console.warn('Unknown layer:', layerName);
                return;
            }
            
            const layerSettings = layout.layers[layerName];
            
            // Update layer state
            layerState[layerName].volume = layerSettings.volume;
            layerState[layerName].mono = layerSettings.mono;
            
            // Update UI controls
            const volumeSlider = document.getElementById(`volume-${layerName}`);
            const volumeValue = document.getElementById(`volume-${layerName}-value`);
            if (volumeSlider) {
                volumeSlider.value = Math.round(layerSettings.volume * 100);
                volumeValue.textContent = `${Math.round(layerSettings.volume * 100)}%`;
            }
            
            if (layerName !== 'backing') {
                const monoToggle = document.getElementById(`mono-${layerName}`);
                if (monoToggle) {
                    monoToggle.checked = layerSettings.mono;
                }
            }
            
            // Update active audio volumes
            updateLayerVolume(layerName, layerSettings.volume);
        });
    }
    
    // Load loop mute states
    if (layout.loops) {
        Object.keys(layout.loops).forEach(loopId => {
            const loop = loops.get(loopId);
            if (loop) {
                const shouldMute = layout.loops[loopId].muted;
                loop.isMuted = shouldMute;
                
                // Update checkbox and mute gain
                const checkbox = document.getElementById(loopId);
                if (checkbox) {
                    checkbox.checked = !shouldMute;
                }
                
                if (loop.muteGainNode) {
                    loop.muteGainNode.gain.value = shouldMute ? 0.0 : 1.0;
                }
            }
        });
    }
    
    // Load trigger mode and release time
    if (layout.triggerMode) {
        triggerMode = layout.triggerMode;
        const radio = document.getElementById(triggerMode === 'trigger' ? 'modeTrigger' : 'modeHold');
        if (radio) radio.checked = true;
    }
    
    if (layout.releaseTime) {
        releaseTime = layout.releaseTime;
        const slider = document.getElementById('releaseTime');
        const value = document.getElementById('releaseTimeValue');
        if (slider) {
            slider.value = releaseTime;
            value.textContent = `${releaseTime}ms`;
        }
    }
    
    if (layout.chokeTime) {
        chokeTime = layout.chokeTime;
        const slider = document.getElementById('chokeTime');
        const value = document.getElementById('chokeTimeValue');
        if (slider) {
            slider.value = chokeTime;
            value.textContent = `${chokeTime}ms`;
        }
    }
    
    // Load camera object assignments
    if (layout.cameraObjects) {
        Object.keys(layout.cameraObjects).forEach(cameraNumber => {
            const objectType = layout.cameraObjects[cameraNumber];
            cameraObjects[cameraNumber] = objectType;
            
            // Update the dropdown
            const selector = document.getElementById(`camera-${cameraNumber}-object`);
            if (selector) {
                selector.value = objectType;
            }
            
            // Update the silhouette
            updateCameraSilhouette(parseInt(cameraNumber), objectType);
        });
    }
    
    // Visual feedback
    const button = document.getElementById('uploadLayout');
    const originalText = button.textContent;
    button.textContent = '✅ Loaded!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
    
    console.log('Layout loaded successfully from file');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Number keys 1-4 to toggle loops
    if (e.code >= 'Digit1' && e.code <= 'Digit4') {
        const index = parseInt(e.code.slice(-1)) - 1;
        const checkbox = document.querySelectorAll('.loop-toggle input')[index];
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
    
    // S to download layout
    if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        downloadLayout();
    }
    
    // L to upload layout
    if (e.code === 'KeyL' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        uploadLayout();
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

// Safari-specific test function
window.safariAudioTest = async function() {
    console.log('=== SAFARI AUDIO TEST ===');
    console.log('User agent:', navigator.userAgent);
    console.log('Is Safari:', /^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    
    if (!audioContext) {
        console.error('❌ Audio context not initialized');
        return;
    }
    
    console.log('Audio context state:', audioContext.state);
    
    // Try to resume context
    if (audioContext.state === 'suspended') {
        console.log('Attempting to resume audio context...');
        try {
            await audioContext.resume();
            console.log('✅ Audio context resumed, new state:', audioContext.state);
        } catch (error) {
            console.error('❌ Failed to resume audio context:', error);
        }
    }
    
    // Test with simple oscillator
    if (audioContext.state === 'running') {
        console.log('Testing with 1-second tone...');
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode);
        
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        
        console.log('✅ Test tone should be playing now');
    } else {
        console.error('❌ Audio context not running:', audioContext.state);
    }
    
    console.log('=== END SAFARI TEST ===');
};

// Get layer for a zone
function getLayerForZone(zoneId) {
    for (const [layerName, config] of Object.entries(layerConfig)) {
        if (config.zones.includes(zoneId)) {
            return layerName;
        }
    }
    return null;
}

// Get layer for a loop
function getLayerForLoop(loopId) {
    for (const [layerName, config] of Object.entries(layerConfig)) {
        if (config.loops.includes(loopId)) {
            return layerName;
        }
    }
    return null;
}

// Update volume for all active audio in a layer
function updateLayerVolume(layerName, volume) {
    // Update active zones in this layer
    const config = layerConfig[layerName];
    config.zones.forEach(zoneId => {
        const audio = activeAudio.get(zoneId);
        if (audio) {
            audio.gainNode.gain.value = volume;
            console.log(`Updated zone ${zoneId} volume to:`, volume);
        }
    });
    
    // Update loops in this layer (main volume, not mute)
    config.loops.forEach(loopId => {
        const loop = loops.get(loopId);
        if (loop && loop.gainNode) {
            loop.gainNode.gain.value = volume;
            console.log(`Updated loop ${loopId} volume to:`, volume);
        }
    });
}

// Update camera silhouette
function updateCameraSilhouette(cameraNumber, objectType) {
    const camera = document.querySelectorAll('.camera-screen')[cameraNumber - 1];
    const existingContainer = camera.querySelector('.camera-silhouette-container');
    
    // Remove existing silhouette
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Add new silhouette
    if (objectType && objectSilhouettes[objectType]) {
        const silhouetteContainer = document.createElement('div');
        silhouetteContainer.className = 'camera-silhouette-container';
        silhouetteContainer.innerHTML = objectSilhouettes[objectType];
        
        // Insert as first child so it appears behind zones
        camera.insertBefore(silhouetteContainer, camera.firstChild);
        
        console.log(`Camera ${cameraNumber} silhouette updated to ${objectType}`);
    }
}

// Setup camera object change listeners
function setupCameraObjectControls() {
    [1, 2, 3, 4].forEach(cameraNumber => {
        const selector = document.getElementById(`camera-${cameraNumber}-object`);
        if (selector) {
            selector.addEventListener('change', (e) => {
                const newObjectType = e.target.value;
                cameraObjects[cameraNumber] = newObjectType;
                updateCameraSilhouette(cameraNumber, newObjectType);
                console.log(`Camera ${cameraNumber} object changed to ${newObjectType}`);
            });
        }
    });
}