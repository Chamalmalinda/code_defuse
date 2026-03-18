

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

const getAudioContext = () => {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
};


export const playCorrect = () => {
    try {
        const ctx        = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type      = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) { console.warn('Sound failed:', e); }
};


export const playWrong = () => {
    try {
        const ctx        = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type      = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) { console.warn('Sound failed:', e); }
};


export const playExplosion = () => {
    try {
        const ctx      = getAudioContext();
        const bufSize  = ctx.sampleRate * 0.8;
        const buffer   = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data     = buffer.getChannelData(0);

        for (let i = 0; i < bufSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
        }

        const source   = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        const filter   = ctx.createBiquadFilter();

        source.buffer = buffer;
        filter.type   = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(1.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        source.start(ctx.currentTime);
    } catch (e) { console.warn('Sound failed:', e); }
};


export const playVictory = () => {
    try {
        const ctx    = getAudioContext();
        const notes  = [523, 659, 784, 1047]; 
        
        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode   = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
            gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);

            oscillator.start(ctx.currentTime + i * 0.15);
            oscillator.stop(ctx.currentTime + i * 0.15 + 0.4);
        });
    } catch (e) { console.warn('Sound failed:', e); }
};


export const playTick = () => {
    try {
        const ctx        = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) { console.warn('Sound failed:', e); }
};