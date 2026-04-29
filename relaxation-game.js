/* 渐进放松助眠游戏 - JavaScript逻辑 */
/* 引导用户逐步放松身体各个部位，帮助快速入睡 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== 数据定义 ====================
    // 步骤定义：breathCycles 表示该步骤持续的呼吸周期数
    // 实际秒数 = breathCycles × 呼吸周期时长（随呼吸速度变化）
    const relaxationSteps = [
        {
            id: 1,
            bodyPart: "额头与头皮",
            instruction: "轻轻闭上眼睛，将注意力集中在额头和头皮上。感受这里的肌肉，然后有意识地让它们完全放松。",
            iconClass: "fas fa-brain",
            breathCycles: 2
        },
        {
            id: 2,
            bodyPart: "眼睛与眼周",
            instruction: "保持眼睛轻闭，不要用力。让眼球自然地向下沉，感受眼周肌肉的放松，就像要进入睡眠一样。",
            iconClass: "fas fa-eye",
            breathCycles: 2
        },
        {
            id: 3,
            bodyPart: "脸颊与下巴",
            instruction: "放松脸颊肌肉，让嘴角微微上扬。让下巴自然下垂，牙齿不要咬合，舌头平放在口腔底部。",
            iconClass: "fas fa-smile",
            breathCycles: 2
        },
        {
            id: 4,
            bodyPart: "颈部",
            instruction: "感受颈部的肌肉，想象它们像柔软的丝绸一样放松。头部自然地靠在枕头或椅子上，不要用力支撑。",
            iconClass: "fas fa-user",
            breathCycles: 2
        },
        {
            id: 5,
            bodyPart: "肩膀",
            instruction: "让双肩自然下沉，远离耳朵。感受肩部的紧张感随着呼气慢慢释放，像卸下重担一样。",
            iconClass: "fas fa-arrows-alt-v",
            breathCycles: 2
        },
        {
            id: 6,
            bodyPart: "手臂与双手",
            instruction: "放松上臂、前臂和双手。手指自然弯曲，不要握拳。想象手臂像羽毛一样轻盈。",
            iconClass: "fas fa-hand-paper",
            breathCycles: 2
        },
        {
            id: 7,
            bodyPart: "胸部与背部",
            instruction: "感受呼吸时胸部的起伏，不要刻意控制。让背部肌肉放松，脊柱自然弯曲，像躺在柔软的云朵上。",
            iconClass: "fas fa-heart",
            breathCycles: 3
        },
        {
            id: 8,
            bodyPart: "腹部",
            instruction: "将注意力集中在腹部，感受呼吸时腹部的自然起伏。让腹肌完全放松，不要收紧。",
            iconClass: "fas fa-dot-circle",
            breathCycles: 2
        },
        {
            id: 9,
            bodyPart: "臀部与骨盆",
            instruction: "放松臀部肌肉，让骨盆自然下沉。想象自己像一滩水一样融化在床或椅子上。",
            iconClass: "fas fa-circle",
            breathCycles: 2
        },
        {
            id: 10,
            bodyPart: "大腿",
            instruction: "感受大腿的重量，让它们完全放松。不要用力支撑，让重力自然地将它们向下拉。",
            iconClass: "fas fa-arrows-alt-h",
            breathCycles: 2
        },
        {
            id: 11,
            bodyPart: "小腿与脚踝",
            instruction: "放松小腿肌肉和脚踝。想象温暖的阳光照射在小腿上，带来舒适和放松的感觉。",
            iconClass: "fas fa-shoe-prints",
            breathCycles: 2
        },
        {
            id: 12,
            bodyPart: "双脚与脚趾",
            instruction: "最后，放松双脚和脚趾。让它们自然分开，不要蜷缩。感受身体从头到脚的完全放松。",
            iconClass: "fas fa-paw",
            breathCycles: 2
        }
    ];

    // 根据呼吸速度获取一个完整呼吸周期的时长（秒）
    function getBreathCycleDuration() {
        switch(breathSpeed) {
            case 'slow':   return 12; // 吸气4+屏息2+呼气6
            case 'fast':   return 6;  // 吸气2+屏息1+呼气3
            case 'medium':
            default:       return 8;  // 吸气3+屏息1+呼气4
        }
    }

    // 根据呼吸速度和步骤的breathCycles计算实际时长（秒）
    function getStepDuration(step) {
        const cycleDuration = getBreathCycleDuration();
        const cycles = step.breathCycles || 2; // 默认2个周期
        return cycles * cycleDuration;
    }

    // ==================== 长时模式步骤生成 ====================
    // 长时模式：3轮递进，每轮停留时间递增，每轮之间有过渡提示
    function generateLongModeSteps() {
        const rounds = [
            {
                roundName: '快速扫描',
                roundHint: '第1轮：快速扫描全身，感受每个部位的存在',
                cycleMultiplier: 1,  // 第1轮：基础周期数
                instructionSuffix: ''
            },
            {
                roundName: '深度放松',
                roundHint: '第2轮：深入每个部位，让放松感更加彻底',
                cycleMultiplier: 1.5,
                instructionSuffix: '让放松的感觉更加深入、更加彻底。'
            },
            {
                roundName: '沉浸入睡',
                roundHint: '第3轮：让整个身体沉入放松，准备进入睡眠',
                cycleMultiplier: 2,
                instructionSuffix: '感受困意渐渐涌来，让身体完全沉入放松之中。'
            }
        ];

        const steps = [];

        rounds.forEach(function(round, roundIndex) {
            // 每轮开始前添加过渡提示步骤
            if (roundIndex > 0) {
                steps.push({
                    id: `round-${roundIndex + 1}-intro`,
                    bodyPart: round.roundName,
                    instruction: round.roundHint,
                    iconClass: 'fas fa-spa',
                    breathCycles: 1,
                    isTransition: true,
                    roundIndex: roundIndex  // 过渡步骤也需要roundIndex来确定播放哪段过渡语音
                });
            }

            // 添加该轮的12个放松步骤
            relaxationSteps.forEach(function(baseStep) {
                var newCycles = Math.round(baseStep.breathCycles * round.cycleMultiplier);
                var newInstruction = baseStep.instruction;
                if (round.instructionSuffix) {
                    newInstruction = newInstruction + ' ' + round.instructionSuffix;
                }
                steps.push({
                    id: `${baseStep.id}-r${roundIndex + 1}`,
                    bodyPart: baseStep.bodyPart,
                    instruction: newInstruction,
                    iconClass: baseStep.iconClass,
                    breathCycles: newCycles,
                    roundIndex: roundIndex,
                    isTransition: false
                });
            });
        });

        return steps;
    }

    // 根据模式获取步骤列表
    function getStepsForMode(mode) {
        if (mode === 'long') {
            return generateLongModeSteps();
        }
        return relaxationSteps.slice(); // 短时模式返回原始步骤的副本
    }

    // 计算步骤列表的总时长（秒），基于当前呼吸速度
    function calculateTotalDuration(steps) {
        return steps.reduce(function(sum, step) { return sum + getStepDuration(step); }, 0);
    }

    // ==================== 状态变量 ====================
    let currentStepIndex = 0;
    let countdownTimer = null;
    let countdownSeconds = 0;
    let isMusicPlaying = true;
    let breathingPhase = 'inhale'; // 'inhale', 'hold', 'exhale'
    let relaxationStatus = []; // 每个步骤的放松状态
    let totalScore = 0; // 总积分
    let currentStepRelaxed = false; // 当前步骤是否已放松
    let breathSpeed = 'medium'; // 'slow', 'medium', 'fast'
    let breathTimer = null; // 呼吸动画计时器
    let sessionMode = 'short'; // 'short' 或 'long'
    let activeSteps = []; // 当前模式实际使用的步骤列表
    
    // 参与度跟踪变量
    let engagementData = []; // 每个步骤的互动数据
    let consecutiveEngagedSteps = 0; // 连续互动步骤数
    let engagementLevel = 1; // 当前参与度等级 (1-4)

    // ==================== 音频系统 ====================
    let audioContext = null; // Web Audio API 上下文
    let ambientSource = null; // 环境音源节点
    let ambientGain = null; // 环境音增益节点
    let currentSoundType = 'rain'; // 当前环境音类型: 'rain', 'whitenoise', 'none'
    let isVoiceEnabled = true; // 人声引导是否开启
    let isAmbientPlaying = false; // 环境音是否正在播放

    // 初始化 Web Audio API
    function initAudio() {
        if (audioContext) {
            // 如果上下文被暂停（浏览器自动播放策略），恢复它
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        } else {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch(e) {
                console.warn('Web Audio API 不可用:', e);
                return;
            }
        }
        // 确保 ambientGain 存在并连接（可能被 VoicePlayer._ensureContext 提前创建了 audioContext）
        if (!ambientGain) {
            ambientGain = audioContext.createGain();
            ambientGain.gain.value = 0;
            ambientGain.connect(audioContext.destination);
        }
    }

    // 生成雨声（滤波白噪音模拟）
    function createRainNoise() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const bufferSize = audioContext.sampleRate * 4; // 4秒循环
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                // 棕噪音算法（更像雨声的低频隆隆声）
                const white = Math.random() * 2 - 1;
                lastOut = (lastOut + (0.02 * white)) / 1.02;
                data[i] = lastOut * 3.5;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 低通滤波让声音更柔和
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        // 高通滤波去除极低频
        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 100;

        // 添加轻微的随机调制模拟雨声变化
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 100;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        ambientSource.connect(highpass);
        highpass.connect(filter);
        filter.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 生成白噪音
    function createWhiteNoise() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 柔化白噪音
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;

        ambientSource.connect(filter);
        filter.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 生成海浪声（周期性涨落的棕噪音 + 噼啪泡沫声）
    function createOceanWaves() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const sr = audioContext.sampleRate;
        const bufferSize = sr * 8; // 8秒一个完整海浪周期
        const buffer = audioContext.createBuffer(2, bufferSize, sr);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const t = i / sr;
                // 棕噪音基底
                const white = Math.random() * 2 - 1;
                lastOut = (lastOut + (0.02 * white)) / 1.02;
                // 海浪周期性涨落（约6秒一个浪）
                const waveEnvelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 6 - Math.PI / 2);
                // 泡沫噼啪声（高频随机脉冲）
                const crackle = (Math.random() > 0.997) ? (Math.random() * 0.3) : 0;
                data[i] = lastOut * 2.5 * waveEnvelope + crackle;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 带通滤波：保留海浪的中低频质感
        const bandpass = audioContext.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 500;
        bandpass.Q.value = 0.4;

        // 缓慢调制滤波器频率模拟海浪远近
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 0.15; // 很慢的调制
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(bandpass.frequency);
        lfo.start();

        ambientSource.connect(bandpass);
        bandpass.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 生成溪流声（高频嘶嘶声 + 偶尔水滴声）
    function createStream() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const sr = audioContext.sampleRate;
        const bufferSize = sr * 6;
        const buffer = audioContext.createBuffer(2, bufferSize, sr);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let lastOut = 0;
            let pinkOut = 0;
            const b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
            const pinkCoeffs = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < bufferSize; i++) {
                // 粉噪音（比白噪音柔和，模拟水流嘶嘶声）
                const white = Math.random() * 2 - 1;
                pinkCoeffs[0] = 0.99886 * pinkCoeffs[0] + white * 0.0555179;
                pinkCoeffs[1] = 0.99332 * pinkCoeffs[1] + white * 0.0750759;
                pinkCoeffs[2] = 0.96900 * pinkCoeffs[2] + white * 0.1538520;
                pinkCoeffs[3] = 0.86650 * pinkCoeffs[3] + white * 0.3104856;
                pinkCoeffs[4] = 0.55000 * pinkCoeffs[4] + white * 0.5329522;
                pinkCoeffs[5] = -0.7616 * pinkCoeffs[5] - white * 0.0168980;
                pinkOut = (pinkCoeffs[0] + pinkCoeffs[1] + pinkCoeffs[2] + pinkCoeffs[3] + pinkCoeffs[4] + pinkCoeffs[5] + pinkCoeffs[6] + white * 0.5362) * 0.11;
                pinkCoeffs[6] = white * 0.115926;

                // 棕噪音低频底流
                lastOut = (lastOut + (0.02 * white)) / 1.02;

                // 偶尔的水滴声（短促高频脉冲）
                const drip = (Math.random() > 0.998) ? (Math.random() * 0.15 * Math.sin(i * 0.5)) : 0;

                // 左右声道略有差异模拟立体感
                const stereoOffset = channel === 0 ? 1.0 : 0.85;
                data[i] = (pinkOut * 0.6 + lastOut * 1.5 + drip) * stereoOffset;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 高通去除极低频 + 低通柔化
        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 200;

        const lowpass = audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 4000;

        // 轻微调制模拟水流变化
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);
        lfo.start();

        ambientSource.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 生成篝火声（噼啪声 + 低频火焰呼呼声）
    function createCampfire() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const sr = audioContext.sampleRate;
        const bufferSize = sr * 6;
        const buffer = audioContext.createBuffer(2, bufferSize, sr);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                // 低频火焰呼呼声（棕噪音）
                const white = Math.random() * 2 - 1;
                lastOut = (lastOut + (0.02 * white)) / 1.02;

                // 噼啪声：随机短促脉冲
                let crackle = 0;
                if (Math.random() > 0.995) {
                    // 一次噼啪持续约5-20ms
                    const crackleLen = Math.floor(sr * (0.005 + Math.random() * 0.015));
                    const crackleAmp = 0.2 + Math.random() * 0.4;
                    for (let j = 0; j < crackleLen && (i + j) < bufferSize; j++) {
                        const env = 1 - j / crackleLen; // 快速衰减
                        data[i + j] = (data[i + j] || 0) + (Math.random() * 2 - 1) * crackleAmp * env;
                    }
                }

                // 火焰呼吸声 + 随机闪烁
                const flicker = 0.7 + 0.3 * Math.sin(2 * Math.PI * i / sr * 0.4);
                data[i] = (data[i] || 0) + lastOut * 2.0 * flicker;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 带通滤波：保留篝火的中低频
        const bandpass = audioContext.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 600;
        bandpass.Q.value = 0.3;

        // 高通去除极低频隆隆声
        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 80;

        ambientSource.connect(highpass);
        highpass.connect(bandpass);
        bandpass.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 生成虫鸣声（周期性蝉鸣 + 蟋蟀声）
    function createCrickets() {
        if (!audioContext || !ambientGain) return;
        stopAmbientSound();

        const sr = audioContext.sampleRate;
        const bufferSize = sr * 10; // 10秒循环
        const buffer = audioContext.createBuffer(2, bufferSize, sr);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / sr;
                let sample = 0;

                // 蟋蟀1：快速啁啾（约4kHz，每0.3秒一组）
                const chirpPhase1 = t % 0.6;
                if (chirpPhase1 < 0.15) {
                    const chirpEnv = Math.sin(Math.PI * chirpPhase1 / 0.15);
                    sample += Math.sin(2 * Math.PI * 4200 * t) * chirpEnv * 0.08;
                    sample += Math.sin(2 * Math.PI * 4800 * t) * chirpEnv * 0.05;
                }

                // 蟋蟀2：稍慢的啁啾（约3.5kHz，偏移相位）
                const chirpPhase2 = (t + 0.3) % 0.8;
                if (chirpPhase2 < 0.2) {
                    const chirpEnv = Math.sin(Math.PI * chirpPhase2 / 0.2);
                    sample += Math.sin(2 * Math.PI * 3500 * t) * chirpEnv * 0.06;
                    sample += Math.sin(2 * Math.PI * 3900 * t) * chirpEnv * 0.04;
                }

                // 蟋蟀3：远处低频虫鸣
                const chirpPhase3 = (t + 0.5) % 1.2;
                if (chirpPhase3 < 0.3) {
                    const chirpEnv = Math.sin(Math.PI * chirpPhase3 / 0.3);
                    sample += Math.sin(2 * Math.PI * 2800 * t) * chirpEnv * 0.04;
                }

                // 背景夜风（极轻的粉噪音）
                const white = Math.random() * 2 - 1;
                sample += white * 0.008;

                // 左右声道略有差异
                const stereo = channel === 0 ? 1.0 : 0.9;
                data[i] = sample * stereo;
            }
        }

        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        // 高通滤波去除低频噪声
        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 1500;

        // 低通柔化高频
        const lowpass = audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 7000;

        ambientSource.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(ambientGain);
        ambientSource.start();
        isAmbientPlaying = true;
    }

    // 停止环境音
    function stopAmbientSound() {
        if (ambientSource) {
            try { ambientSource.stop(); } catch(e) {}
            ambientSource.disconnect();
            ambientSource = null;
        }
        isAmbientPlaying = false;
    }

    // 播放当前选择的环境音
    function playAmbientSound() {
        if (!audioContext) return;

        // 如果 AudioContext 被浏览器暂停（自动播放策略），先恢复
        // resume() 是异步的，需要等待完成后再创建音频源
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(function() {
                actuallyPlayAmbient();
            }).catch(function(e) {
                console.warn('AudioContext resume 失败:', e);
            });
            return;
        }

        actuallyPlayAmbient();
    }

    // 实际播放环境音（AudioContext 已确保 running）
    function actuallyPlayAmbient() {
        if (!audioContext) return;

        if (currentSoundType === 'none') {
            stopAmbientSound();
            fadeOutAmbient();
            return;
        }

        switch (currentSoundType) {
            case 'rain':       createRainNoise(); break;
            case 'ocean':      createOceanWaves(); break;
            case 'stream':     createStream(); break;
            case 'campfire':   createCampfire(); break;
            case 'crickets':   createCrickets(); break;
            case 'whitenoise': createWhiteNoise(); break;
            default:           createRainNoise(); break;
        }

        fadeInAmbient();
    }

    // 环境音淡入
    function fadeInAmbient() {
        if (!ambientGain) return;
        ambientGain.gain.cancelScheduledValues(audioContext.currentTime);
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioContext.currentTime);
        ambientGain.gain.linearRampToValueAtTime(isMusicPlaying ? 0.3 : 0, audioContext.currentTime + 2);
    }

    // 环境音淡出
    function fadeOutAmbient() {
        if (!ambientGain) return;
        ambientGain.gain.cancelScheduledValues(audioContext.currentTime);
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioContext.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
    }

    // ==================== 真人语音引导系统（独立文件 + 互斥锁架构） ====================
    // 每个步骤对应一个独立MP3文件，从 voices/ 目录加载
    // VoicePlayer 单例保证同一时间只有一段语音在播放

    // 步骤ID → 语音文件名映射（不含路径和扩展名）
    const voiceFiles = {
        opening:   'v-opening',
        forehead:  'v-forehead',
        eyes:      'v-eyes',
        face:      'v-face',
        neck:      'v-neck',
        shoulders: 'v-shoulders',
        arms:      'v-arms',
        chest:     'v-chest',
        abdomen:   'v-abdomen',
        hips:      'v-hips',
        thighs:    'v-thighs',
        calves:    'v-calves',
        feet:      'v-feet',
        round2:    'v-round2',
        round3:    'v-round3',
        deepRelax: 'v-deep-relax',
        sleepSink: 'v-sleep-sink',
        ending:    'v-ending'
    };

    // 步骤数字ID → 语音key映射
    const stepVoiceMap = {
        1: 'forehead', 2: 'eyes', 3: 'face', 4: 'neck', 5: 'shoulders',
        6: 'arms', 7: 'chest', 8: 'abdomen', 9: 'hips', 10: 'thighs',
        11: 'calves', 12: 'feet'
    };

    // ========== VoicePlayer 单例 ==========
    const VoicePlayer = {
        // 状态
        _state: 'idle',           // 'idle' | 'playing' | 'stopping'
        _currentSource: null,     // 当前 AudioBufferSourceNode
        _currentKey: null,        // 当前播放的语音key
        _gainNode: null,          // 语音增益节点
        _bufferCache: {},         // 已解码的AudioBuffer缓存 { key: AudioBuffer }
        _loadingSet: {},          // 正在加载的key集合 { key: true }
        _pendingTimers: [],       // 所有待执行的setTimeout ID，stop时统一清除
        _playGeneration: 0,       // 播放代数，用于取消过时的回调
        _onEndedCallback: null,   // 当前播放结束后的回调
        _debugMode: false,        // 调试模式

        // 获取当前状态
        get state() { return this._state; },
        get isPlaying() { return this._state === 'playing'; },
        get currentKey() { return this._currentKey; },

        // 确保 AudioContext 和增益节点存在
        _ensureContext: function() {
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch(e) {
                    console.warn('Web Audio API 不可用:', e);
                    return false;
                }
            }
            if (!this._gainNode) {
                this._gainNode = audioContext.createGain();
                this._gainNode.gain.value = 0.9;
                this._gainNode.connect(audioContext.destination);
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            return true;
        },

        // 加载并缓存一个语音文件（懒加载，首次播放时触发）
        _loadBuffer: function(key) {
            var self = this;
            // 已缓存
            if (self._bufferCache[key]) {
                return Promise.resolve(self._bufferCache[key]);
            }
            // 正在加载
            if (self._loadingSet[key]) {
                return new Promise(function(resolve) {
                    // 轮询等待加载完成
                    var check = setInterval(function() {
                        if (self._bufferCache[key]) {
                            clearInterval(check);
                            resolve(self._bufferCache[key]);
                        }
                    }, 50);
                    // 超时5秒
                    setTimeout(function() { clearInterval(check); resolve(null); }, 5000);
                });
            }
            // 开始加载
            self._loadingSet[key] = true;
            var filename = voiceFiles[key];
            if (!filename) {
                console.warn('未知的语音key:', key);
                delete self._loadingSet[key];
                return Promise.resolve(null);
            }

            if (!self._ensureContext()) {
                delete self._loadingSet[key];
                return Promise.resolve(null);
            }

            return fetch('voices/' + filename + '.mp3')
                .then(function(response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.arrayBuffer();
                })
                .then(function(arrayBuffer) { return audioContext.decodeAudioData(arrayBuffer); })
                .then(function(buffer) {
                    self._bufferCache[key] = buffer;
                    delete self._loadingSet[key];
                    if (self._debugMode) {
                        console.log('🔊 语音已缓存: ' + key + ' (' + buffer.duration.toFixed(2) + 's)');
                    }
                    return buffer;
                })
                .catch(function(e) {
                    delete self._loadingSet[key];
                    console.warn('语音加载失败 [' + key + ']:', e.message || e);
                    return null;
                });
        },

        // 预加载所有语音文件（在startRelaxation时调用）
        preloadAll: function() {
            var self = this;
            if (!self._ensureContext()) return;
            var keys = Object.keys(voiceFiles);
            keys.forEach(function(key) {
                self._loadBuffer(key);
            });
        },

        // 播放指定语音（互斥：自动停止当前播放）
        // onEnded: 播放自然结束后的回调（被stop()中断时不触发）
        play: function(key, onEnded) {
            var self = this;

            if (!isVoiceEnabled) return;

            // 互斥：先停止当前播放
            if (self._state === 'playing') {
                self._stopInternal();
            }

            // 递增代数
            self._playGeneration++;
            var gen = self._playGeneration;

            self._onEndedCallback = onEnded || null;

            // 加载并播放
            self._loadBuffer(key).then(function(buffer) {
                // 检查代数（可能用户已切换步骤）
                if (self._playGeneration !== gen) return;
                if (!isVoiceEnabled) return;

                // 加载失败（文件不存在等）：延迟2秒后触发回调，让准备页有展示时间
                if (!buffer) {
                    self._state = 'idle';
                    self.setTimeout(function() {
                        if (self._playGeneration === gen && self._onEndedCallback) {
                            var cb = self._onEndedCallback;
                            self._onEndedCallback = null;
                            cb();
                        }
                    }, 2000);
                    return;
                }

                if (!self._ensureContext()) return;

                // 创建 AudioBufferSourceNode
                var source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(self._gainNode);

                self._currentSource = source;
                self._currentKey = key;
                self._state = 'playing';

                if (self._debugMode) {
                    console.log('🔊 [gen=' + gen + '] 播放语音: ' + key + ' (' + buffer.duration.toFixed(2) + 's)');
                }

                // 播放结束回调
                source.onended = function() {
                    if (self._currentSource === source) {
                        self._currentSource = null;
                        self._currentKey = null;
                        self._state = 'idle';
                    }
                    if (self._debugMode) {
                        console.log('🔇 [gen=' + gen + '] 语音播放结束: ' + key);
                    }
                    // 仅在代数一致且未被stop()中断时触发回调
                    if (self._playGeneration === gen && self._onEndedCallback) {
                        var cb = self._onEndedCallback;
                        self._onEndedCallback = null;
                        cb();
                    }
                };

                source.start(0);
            });
        },

        // 停止当前播放（内部使用，不清理timers）
        _stopInternal: function() {
            if (this._currentSource) {
                try {
                    this._currentSource.onended = null;
                    this._currentSource.stop();
                    this._currentSource.disconnect();
                } catch(e) { /* 可能已自然结束 */ }
                this._currentSource = null;
            }
            this._currentKey = null;
            this._state = 'idle';
            this._onEndedCallback = null;
        },

        // 停止当前播放并清除所有待执行定时器（外部调用）
        stop: function() {
            // 递增代数使所有异步回调失效
            this._playGeneration++;
            // 停止当前播放
            this._stopInternal();
            // 清除所有待执行的定时器
            this._clearAllTimers();
        },

        // 注册一个setTimeout，stop时会自动清除
        setTimeout: function(fn, delayMs) {
            var self = this;
            var id = setTimeout(function() {
                // 从列表中移除已执行的timer
                var idx = self._pendingTimers.indexOf(id);
                if (idx !== -1) self._pendingTimers.splice(idx, 1);
                fn();
            }, delayMs);
            this._pendingTimers.push(id);
            return id;
        },

        // 清除所有待执行的定时器
        _clearAllTimers: function() {
            this._pendingTimers.forEach(function(id) {
                clearTimeout(id);
            });
            this._pendingTimers = [];
        },

        // 获取语音文件时长（如果已缓存）
        getDuration: function(key) {
            if (this._bufferCache[key]) {
                return this._bufferCache[key].duration;
            }
            return null;
        }
    };


    // 语音调试开关（控制台可用）
    window.voiceDebug = function(enable) {
        VoicePlayer._debugMode = enable !== false;
        console.log(VoicePlayer._debugMode ? '🔊 语音调试模式已开启' : '🔇 语音调试模式已关闭');
        console.log('可用命令: voiceDebug(true/false), voicePlay("key"), voiceStatus()');
    };
    // 快速播放某段语音（调试用）
    window.voicePlay = function(key) {
        if (!voiceFiles[key]) { console.warn('未知段名:', key, '可用:', Object.keys(voiceFiles)); return; }
        VoicePlayer.play(key);
    };
    // 查看语音状态（调试用）
    window.voiceStatus = function() {
        return {
            state: VoicePlayer.state,
            currentKey: VoicePlayer.currentKey,
            cachedKeys: Object.keys(VoicePlayer._bufferCache),
            generation: VoicePlayer._playGeneration,
            pendingTimers: VoicePlayer._pendingTimers.length
        };
    };

    // 初始化语音系统（预加载所有文件）
    function initVoiceAudio() {
        VoicePlayer.preloadAll();
    }

    // 播放步骤对应的语音（身体部位引导）
    function speakInstruction(text) {
        if (!isVoiceEnabled) return;

        const step = activeSteps[currentStepIndex];
        if (!step) return;

        // 过渡步骤
        if (step.isTransition) {
            playTransitionVoice(step);
            return;
        }

        // 获取步骤的基础ID
        const baseId = typeof step.id === 'string' ? parseInt(step.id.split('-')[0]) : step.id;
        const voiceKey = stepVoiceMap[baseId];

        if (!voiceKey) return;

        // 深度入睡模式第2/3轮：基础引导 → onEnded回调追加
        if (sessionMode === 'long' && step.roundIndex !== undefined && step.roundIndex > 0) {
            var appendKey = null;
            if (step.roundIndex === 1) {
                appendKey = 'deepRelax';
            } else if (step.roundIndex === 2) {
                appendKey = 'sleepSink';
            }
            if (appendKey) {
                // 先播放基础引导，onEnded时自动追加
                VoicePlayer.play(voiceKey, function() {
                    // onEnded回调：基础引导自然结束后播放追加词
                    // VoicePlayer.play内部会递增generation，所以回调只在自然结束时触发
                    if (isVoiceEnabled && appendKey) {
                        VoicePlayer.play(appendKey);
                    }
                });
            } else {
                VoicePlayer.play(voiceKey);
            }
        } else {
            VoicePlayer.play(voiceKey);
        }
    }

    // 播放过渡步骤语音
    function playTransitionVoice(step) {
        if (!isVoiceEnabled) return;
        const roundIndex = step.roundIndex;
        if (roundIndex === 1) {
            VoicePlayer.play('round2');
        } else if (roundIndex === 2) {
            VoicePlayer.play('round3');
        }
    }

    // 播放开场引导
    function playOpeningVoice() {
        if (!isVoiceEnabled) return;
        VoicePlayer.play('opening');
    }

    // 播放结束引导
    function playEndingVoice() {
        if (!isVoiceEnabled) return;
        VoicePlayer.play('ending');
    }

    // 播放呼吸词语音
    // 呼吸词（吸气/屏息/呼气）仅文字提示，不播放语音，避免与步骤引导语冲突
    function playBreathVoice(phase) {
        return;
    }

    // 停止人声引导
    function stopSpeaking() {
        VoicePlayer.stop();
    }

    // ==================== DOM 元素引用 ====================
    // 屏幕
    const welcomeScreen = document.getElementById('welcome-screen');
    const relaxationScreen = document.getElementById('relaxation-screen');
    const completionScreen = document.getElementById('completion-screen');
    
    // 按钮
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    const musicToggle = document.getElementById('music-toggle');
    
    // 放松界面元素
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const timerElement = document.getElementById('timer');
    const countdownElement = document.getElementById('countdown');
    const bodyPartIcon = document.getElementById('body-part-icon');
    const bodyPartTitle = document.getElementById('body-part-title');
    const instructionText = document.getElementById('instruction-text');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = breathingCircle.querySelector('.breathing-text');
    
    // 互动区域元素
    const bodyPartVisual = document.getElementById('body-part-visual');
    const interactiveFeedback = document.getElementById('interactive-feedback');
    const relaxProgress = document.getElementById('relax-progress');
    
    // 音乐信息
    const musicInfo = document.getElementById('music-info');

    // ==================== 初始化 ====================
    function init() {
        // 初始化当前模式的步骤列表
        activeSteps = getStepsForMode(sessionMode);
        
        // 初始化放松状态数组
        relaxationStatus = activeSteps.map(() => false);
        
        // 初始化参与度数据
        engagementData = activeSteps.map(() => ({
            clicked: false,
            clickTime: 0, // 从步骤开始到点击的秒数
            clickCount: 0, // 点击次数
            stepStartTime: 0 // 步骤开始的时间戳
        }));
        
        // 设置事件监听器
        startBtn.addEventListener('click', startRelaxation);
        prevBtn.addEventListener('click', goToPreviousStep);
        nextBtn.addEventListener('click', goToNextStep);
        restartBtn.addEventListener('click', restartRelaxation);
        homeBtn.addEventListener('click', goToHome);
        musicToggle.addEventListener('click', toggleMusic);

        // 放松界面返回首页按钮
        const backHomeBtn = document.getElementById('back-home-btn');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('[返回首页] 按钮被点击');
                showHomeConfirm();
            });
        }
        
        // 设置呼吸速度选项事件监听器
        setupBreathSpeedOptions();
        
        // 设置时长模式选项事件监听器
        setupModeOptions();

        // 设置环境音选项事件监听器
        setupSoundOptions();

        // 设置人声引导开关
        setupVoiceToggle();
        
        // 设置流程一览折叠
        setupFlowCollapse();
        
        // 更新流程一览
        updateFlowOverview();
        
        // 初始化音乐状态
        updateMusicUI();

        // 语音预加载延迟到用户点击"开始"时执行（避免页面加载时触发AudioContext autoplay限制）

        // 初始化星空背景
        initStarfield();
    }
    
    // ==================== 呼吸速度设置 ====================
    function setupBreathSpeedOptions() {
        const speedOptions = document.querySelectorAll('.speed-option');
        
        speedOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有active类
                speedOptions.forEach(opt => opt.classList.remove('active'));
                
                // 添加active类到当前选项
                this.classList.add('active');
                
                // 更新呼吸速度
                breathSpeed = this.getAttribute('data-speed');
                console.log(`呼吸速度设置为: ${breathSpeed}`);
                
                // 更新呼吸动画
                updateBreathingAnimation();

                // 如果正在放松中，重新计算当前步骤的倒计时
                if (relaxationScreen.classList.contains('active')) {
                    const step = activeSteps[currentStepIndex];
                    if (step) {
                        countdownSeconds = getStepDuration(step);
                        startCountdown();
                    }
                    // 更新流程一览（总时长变了）
                    updateFlowOverview();
                }
            });
        });
    }

    // ==================== 时长模式选择 ====================
    function setupModeOptions() {
        const modeOptions = document.querySelectorAll('.mode-option');
        
        modeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有active类
                modeOptions.forEach(opt => opt.classList.remove('active'));
                
                // 添加active类到当前选项
                this.classList.add('active');
                
                // 更新模式
                sessionMode = this.getAttribute('data-mode');
                console.log(`时长模式设置为: ${sessionMode}`);
                
                // 更新步骤列表
                activeSteps = getStepsForMode(sessionMode);
                
                // 重置状态
                relaxationStatus = activeSteps.map(() => false);
                engagementData = activeSteps.map(() => ({
                    clicked: false,
                    clickTime: 0,
                    clickCount: 0,
                    stepStartTime: 0
                }));
                totalScore = 0;
                consecutiveEngagedSteps = 0;
                engagementLevel = 1;
                
                // 更新流程一览
                updateFlowOverview();
            });
        });
    }

    // ==================== 环境音选项设置 ====================
    function setupSoundOptions() {
        const soundOptions = document.querySelectorAll('.sound-option');
        
        soundOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有active类
                soundOptions.forEach(opt => opt.classList.remove('active'));
                
                // 添加active类到当前选项
                this.classList.add('active');
                
                // 更新环境音类型
                currentSoundType = this.getAttribute('data-sound');
                console.log(`环境音设置为: ${currentSoundType}`);
                
                // 如果选择了"无"，暂停音乐状态
                if (currentSoundType === 'none') {
                    isMusicPlaying = false;
                    fadeOutAmbient();
                } else {
                    // 选择了有效音源，自动开启播放
                    isMusicPlaying = true;
                    // 如果正在放松中，切换环境音
                    if (relaxationScreen.classList.contains('active')) {
                        initAudio();
                        playAmbientSound();
                    }
                }
                
                // 更新音乐UI
                updateMusicUI();
            });
        });
    }

    // ==================== 人声引导开关设置 ====================
    function setupVoiceToggle() {
        // 首页的人声引导开关
        const voiceToggle = document.getElementById('voice-toggle');
        // 浮动人声引导按钮
        const voiceToggleFloat = document.getElementById('voice-toggle-float');

        // 同步两个开关的视觉状态
        function syncVoiceToggleUI() {
            if (voiceToggle) {
                voiceToggle.classList.toggle('active', isVoiceEnabled);
                voiceToggle.setAttribute('data-on', isVoiceEnabled);
            }
            if (voiceToggleFloat) {
                voiceToggleFloat.classList.toggle('active', isVoiceEnabled);
                voiceToggleFloat.style.color = isVoiceEnabled ? '#8a9eff' : '#8888aa';
            }
        }

        // 初始化浮动按钮状态
        syncVoiceToggleUI();

        if (voiceToggle) {
            voiceToggle.addEventListener('click', function() {
                isVoiceEnabled = !isVoiceEnabled;
                syncVoiceToggleUI();
                console.log(`人声引导: ${isVoiceEnabled ? '开启' : '关闭'}`);
                
                // 如果在放松中，根据状态朗读或停止
                if (relaxationScreen.classList.contains('active')) {
                    if (isVoiceEnabled) {
                        const step = activeSteps[currentStepIndex];
                        if (step) speakInstruction(step.instruction);
                    } else {
                        stopSpeaking();
                    }
                }
            });
        }

        if (voiceToggleFloat) {
            voiceToggleFloat.addEventListener('click', function() {
                isVoiceEnabled = !isVoiceEnabled;
                syncVoiceToggleUI();
                console.log(`人声引导: ${isVoiceEnabled ? '开启' : '关闭'}`);
                
                if (relaxationScreen.classList.contains('active')) {
                    if (isVoiceEnabled) {
                        const step = activeSteps[currentStepIndex];
                        if (step) speakInstruction(step.instruction);
                    } else {
                        stopSpeaking();
                    }
                }
            });
        }
    }

    // ==================== 睡眠日程（localStorage持久化） ====================
    const STORAGE_KEY = 'relaxation_sleep_diary';

    // 从localStorage读取日程数据
    function loadSleepDiary() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch(e) {
            console.warn('读取睡眠日程失败:', e);
            return [];
        }
    }

    // 保存日程数据到localStorage
    function saveSleepDiary(diary) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(diary));
        } catch(e) {
            console.warn('保存睡眠日程失败:', e);
        }
    }

    // 保存本次放松记录
    function saveTodayRecord() {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const totalDuration = calculateTotalDuration(activeSteps);
        const modeName = sessionMode === 'long' ? '深度入睡' : '短时放松';
        const relaxedCount = relaxationStatus.filter(s => s).length;

        const record = {
            date: dateStr,
            time: timeStr,
            mode: modeName,
            duration: totalDuration,
            steps: activeSteps.length,
            relaxed: relaxedCount,
            score: totalScore
        };

        const diary = loadSleepDiary();
        // 检查今天是否已有记录，有则更新，无则添加
        const todayIndex = diary.findIndex(r => r.date === dateStr);
        if (todayIndex >= 0) {
            // 今天已有记录，更新（保留最高分）
            if (record.score > diary[todayIndex].score) {
                diary[todayIndex] = record;
            }
        } else {
            diary.unshift(record); // 最新的在前
        }

        // 最多保留30条记录
        if (diary.length > 30) {
            diary.length = 30;
        }

        saveSleepDiary(diary);
    }

    // 更新完成界面的睡眠日程显示
    function updateSleepDiaryUI() {
        const diary = loadSleepDiary();
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

        // 更新今日记录
        const diaryDateEl = document.getElementById('diary-date');
        const diaryModeEl = document.getElementById('diary-mode');
        const diaryDurationEl = document.getElementById('diary-duration');

        const todayRecord = diary.find(r => r.date === todayStr);
        if (diaryDateEl) {
            diaryDateEl.textContent = todayStr;
        }
        if (diaryModeEl) {
            diaryModeEl.textContent = todayRecord ? todayRecord.mode : (sessionMode === 'long' ? '深度入睡' : '短时放松');
        }
        if (diaryDurationEl) {
            const dur = todayRecord ? todayRecord.duration : calculateTotalDuration(activeSteps);
            const min = Math.floor(dur / 60);
            const sec = dur % 60;
            diaryDurationEl.textContent = min > 0 ? `${min}分${sec > 0 ? sec + '秒' : ''}` : `${dur}秒`;
        }

        // 更新历史记录列表
        const historyEl = document.getElementById('diary-history');
        if (historyEl) {
            // 排除今天，显示历史
            const historyRecords = diary.filter(r => r.date !== todayStr).slice(0, 7);
            if (historyRecords.length === 0) {
                historyEl.innerHTML = '<p style="color:#5858a0;font-size:0.78rem;text-align:center;padding:8px;">暂无历史记录</p>';
            } else {
                historyEl.innerHTML = historyRecords.map(r => {
                    const min = Math.floor(r.duration / 60);
                    const sec = r.duration % 60;
                    const durText = min > 0 ? `${min}分${sec > 0 ? sec + '秒' : ''}` : `${r.duration}秒`;
                    return `<div class="diary-history-item">
                        <span class="diary-history-date">${r.date}</span>
                        <span class="diary-history-info">
                            <span>${r.mode}</span>
                            <span>${durText}</span>
                            <span>${r.score}分</span>
                        </span>
                    </div>`;
                }).join('');
            }
        }
    }

    // ==================== 流程一览折叠 ====================
    function setupFlowCollapse() {
        const flowOverview = document.querySelector('.flow-overview');
        if (flowOverview) {
            const h3 = flowOverview.querySelector('h3');
            if (h3) {
                h3.addEventListener('click', function() {
                    flowOverview.classList.toggle('collapsed');
                });
            }
        }
    }

    // ==================== 流程一览更新 ====================
    function updateFlowOverview() {
        const stepCountEl = document.getElementById('flow-step-count');
        const durationEl = document.getElementById('flow-duration');
        const roundsEl = document.getElementById('flow-rounds');
        
        if (!stepCountEl || !durationEl) return;
        
        const totalDuration = calculateTotalDuration(activeSteps);
        
        if (sessionMode === 'long') {
            stepCountEl.textContent = activeSteps.length;
            // 超过60秒显示分钟
            const minutes = Math.floor(totalDuration / 60);
            const seconds = totalDuration % 60;
            durationEl.textContent = minutes > 0 ? `${minutes}分${seconds > 0 ? seconds + '秒' : ''}` : `${totalDuration}秒`;
            roundsEl.textContent = '3轮递进 · 全程呼吸引导';
        } else {
            stepCountEl.textContent = activeSteps.length;
            const minutes = Math.floor(totalDuration / 60);
            const seconds = totalDuration % 60;
            durationEl.textContent = minutes > 0 ? `${minutes}分${seconds > 0 ? seconds + '秒' : ''}` : `${totalDuration}秒`;
            roundsEl.textContent = '全程呼吸引导';
        }
    }

    // ==================== 屏幕切换 ====================
    function showScreen(screenElement) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 显示目标屏幕
        screenElement.classList.add('active');
    }

    // ==================== 放松流程控制 ====================
    // 准备过渡页的DOM引用
    const preparingScreen = document.getElementById('preparing-screen');

    // 从准备页进入正式放松流程
    function enterRelaxation() {
        currentStepIndex = 0;
        loadStep(currentStepIndex);
        showScreen(relaxationScreen);
        
        // 启动呼吸动画（确保在放松界面运行）
        updateBreathingAnimation();

        // 同步浮动语音按钮状态
        const voiceToggleFloat = document.getElementById('voice-toggle-float');
        if (voiceToggleFloat) {
            voiceToggleFloat.classList.toggle('active', isVoiceEnabled);
            voiceToggleFloat.style.color = isVoiceEnabled ? '#8a9eff' : '#8888aa';
        }
    }

    function startRelaxation() {
        try {
            // 初始化音频（在用户点击事件中初始化，确保浏览器允许音频播放）
            initAudio();
            if (isMusicPlaying && currentSoundType !== 'none') {
                playAmbientSound();
            }

            // 初始化语音系统
            initVoiceAudio();

            // 显示准备过渡页
            showScreen(preparingScreen);

            // 播放开场引导语音，播完后自动进入第1步
            if (isVoiceEnabled) {
                VoicePlayer.play('opening', function() {
                    // 开场语音自然结束 → 进入正式放松
                    enterRelaxation();
                });
                // 兜底：如果语音文件加载失败或超时，也自动进入
                // 开场语音约6-7秒，加上缓冲设15秒兜底
                VoicePlayer.setTimeout(function() {
                    if (preparingScreen.classList.contains('active')) {
                        VoicePlayer.stop();
                        enterRelaxation();
                    }
                }, 15000);
            } else {
                // 语音关闭 → 2秒后自动进入
                setTimeout(function() {
                    enterRelaxation();
                }, 2000);
            }
        } catch(e) {
            console.error('startRelaxation 异常:', e);
            // 出错时直接进入放松界面，不让用户卡住
            enterRelaxation();
        }
    }

    function loadStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= activeSteps.length) return;
        
        const step = activeSteps[stepIndex];
        
        // 记录步骤开始时间（用于计算点击响应时间）
        engagementData[stepIndex].stepStartTime = Date.now();
        
        // 更新UI
        bodyPartIcon.innerHTML = `<i class="${step.iconClass}"></i>`;
        bodyPartTitle.textContent = step.bodyPart;
        instructionText.textContent = step.instruction;
        
        // 更新进度
        const progressPercentage = ((stepIndex + 1) / activeSteps.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        // 长时模式显示轮次信息
        if (sessionMode === 'long' && step.roundIndex !== undefined) {
            progressText.textContent = `第${step.roundIndex + 1}轮 · 步骤 ${stepIndex + 1}/${activeSteps.length}`;
        } else {
            progressText.textContent = `步骤 ${stepIndex + 1}/${activeSteps.length}`;
        }
        
        // 设置倒计时（基于呼吸周期）
        countdownSeconds = getStepDuration(step);
        updateCountdownDisplay();
        
        // 启动倒计时
        startCountdown();
        
        // 更新按钮状态
        prevBtn.disabled = stepIndex === 0;
        
        // 如果是最后一步，更改下一步按钮文本
        if (stepIndex === activeSteps.length - 1) {
            nextBtn.innerHTML = '完成放松 <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = '下一步 <i class="fas fa-arrow-right"></i>';
        }
        
        // 更新互动区域
        updateInteractiveArea(stepIndex);
        
        // 重置当前步骤放松状态
        currentStepRelaxed = relaxationStatus[stepIndex];

        // 人声引导：朗读当前步骤的引导语
        // 开场引导已在准备过渡页播放完毕，进入第1步时直接播放步骤语音
        speakInstruction(step.instruction);
    }
    
    // ==================== 互动区域更新 ====================
    function updateInteractiveArea(stepIndex) {
        const step = activeSteps[stepIndex];
        const isRelaxed = relaxationStatus[stepIndex];
        
        // 清空现有内容
        bodyPartVisual.innerHTML = '';
        
        // 创建可点击的部位圆圈
        const partCircle = document.createElement('div');
        partCircle.className = `part-circle ${isRelaxed ? 'relaxed' : ''}`;
        partCircle.innerHTML = `<i class="${step.iconClass}"></i>`;
        partCircle.title = `点击确认${step.bodyPart}已放松`;
        
        // 添加点击事件
        partCircle.addEventListener('click', function(event) {
            // 记录点击数据
            const stepData = engagementData[stepIndex];
            stepData.clickCount++;
            
            // 如果是第一次点击，记录点击时间
            if (!stepData.clicked) {
                const clickTime = Date.now() - stepData.stepStartTime;
                stepData.clickTime = Math.floor(clickTime / 1000); // 转换为秒
                stepData.clicked = true;
                
                // 更新连续互动步骤数
                if (stepIndex === 0 || engagementData[stepIndex - 1].clicked) {
                    consecutiveEngagedSteps++;
                } else {
                    consecutiveEngagedSteps = 1;
                }
            }
            
            if (!relaxationStatus[stepIndex]) {
                // 标记为已放松
                relaxationStatus[stepIndex] = true;
                partCircle.classList.add('relaxed');
                currentStepRelaxed = true;
                
                // 根据点击时间计算额外积分（越快点击积分越高）
                let extraScore = 0;
                if (stepData.clickTime <= 2) {
                    extraScore = 5; // 2秒内点击额外加5分
                } else if (stepData.clickTime <= 5) {
                    extraScore = 3; // 5秒内点击额外加3分
                }
                
                // 增加积分
                totalScore += (10 + extraScore);
                
                // 播放音效（如果有）
                playRelaxSound();
                
                // 更新反馈
                updateRelaxationFeedback();
                
                // 视觉反馈
                partCircle.style.animation = 'none';
                setTimeout(() => {
                    partCircle.style.animation = '';
                }, 10);
                
                // 创建粒子效果（根据点击次数调整粒子数量）
                const particleCount = 8 + Math.min(stepData.clickCount - 1, 5) * 2;
                createParticles(event.clientX, event.clientY, particleCount);
            }
        });
        
        bodyPartVisual.appendChild(partCircle);
        
        // 更新放松反馈
        updateRelaxationFeedback();
    }
    
    // 计算参与度等级
    function calculateEngagementLevel() {
        const engagementScore = calculateEngagementScore();
        
        // 根据总评分确定等级
        if (engagementScore >= 76) {
            return 4; // 专注者
        } else if (engagementScore >= 51) {
            return 3; // 参与者
        } else if (engagementScore >= 26) {
            return 2; // 初学者
        } else {
            return 1; // 观察者
        }
    }
    
    // 获取参与度等级名称
    function getEngagementLevelName(level) {
        switch(level) {
            case 1: return '观察者';
            case 2: return '初学者';
            case 3: return '参与者';
            case 4: return '专注者';
            default: return '观察者';
        }
    }
    
    // 获取参与度等级描述
    function getEngagementLevelDescription(level) {
        switch(level) {
            case 1: return '被动观看，很少互动';
            case 2: return '开始尝试互动，但不够积极';
            case 3: return '积极互动，完成大部分步骤';
            case 4: return '高度投入，响应迅速且持续';
            default: return '被动观看，很少互动';
        }
    }
    
    // 更新放松反馈
    function updateRelaxationFeedback() {
        const relaxedCount = relaxationStatus.filter(status => status).length;
        const totalSteps = activeSteps.length;
        const progressPercent = Math.round((relaxedCount / totalSteps) * 100);
        
        // 更新参与度等级
        engagementLevel = calculateEngagementLevel();
        const levelName = getEngagementLevelName(engagementLevel);
        
        relaxProgress.textContent = `${progressPercent}%`;
        interactiveFeedback.innerHTML = `放松进度: <span id="relax-progress">${progressPercent}%</span> | 积分: <span id="score">${totalScore}</span> | 参与度: <span id="engagement-level">${levelName}</span>`;
        
        // 根据参与度等级更新视觉反馈
        updateEngagementVisualFeedback();
    }
    
    // 计算参与度分数（0-100）
    function calculateEngagementScore() {
        const relaxedCount = relaxationStatus.filter(status => status).length;
        const totalSteps = activeSteps.length;
        const progressPercent = Math.round((relaxedCount / totalSteps) * 100);
        
        // 计算平均点击时间（秒）
        const clickedSteps = engagementData.filter(data => data.clicked);
        const avgClickTime = clickedSteps.length > 0 
            ? clickedSteps.reduce((sum, data) => sum + data.clickTime, 0) / clickedSteps.length
            : 0;
        
        // 计算平均点击次数
        const avgClickCount = clickedSteps.length > 0
            ? clickedSteps.reduce((sum, data) => sum + data.clickCount, 0) / clickedSteps.length
            : 0;
        
        // 参与度评分算法
        let engagementScore = 0;
        
        // 1. 进度百分比权重最大（50%）
        engagementScore += progressPercent * 0.5;
        
        // 2. 响应速度权重（25%）：点击越快得分越高
        const speedScore = avgClickTime > 0 ? Math.max(0, 100 - (avgClickTime * 10)) : 0;
        engagementScore += speedScore * 0.25;
        
        // 3. 互动频率权重（15%）：点击次数越多得分越高
        const frequencyScore = Math.min(100, avgClickCount * 20);
        engagementScore += frequencyScore * 0.15;
        
        // 4. 连续性权重（10%）：连续互动步骤越多得分越高
        const continuityScore = Math.min(100, (consecutiveEngagedSteps / totalSteps) * 100);
        engagementScore += continuityScore * 0.1;
        
        return Math.min(100, Math.max(0, Math.round(engagementScore)));
    }
    
    // 根据参与度等级更新视觉反馈
    function updateEngagementVisualFeedback() {
        // 计算参与度分数
        const engagementScore = calculateEngagementScore();
        
        // 移除旧的等级样式
        interactiveFeedback.classList.remove('engagement-level-1', 'engagement-level-2', 'engagement-level-3', 'engagement-level-4');
        
        // 添加当前等级样式
        interactiveFeedback.classList.add(`engagement-level-${engagementLevel}`);
        
        // 根据等级更新反馈区域颜色
        const levelColors = {
            1: '#8888aa', // 观察者 - 灰色
            2: '#6c8cff', // 初学者 - 蓝色
            3: '#4caf50', // 参与者 - 绿色
            4: '#ffd166'  // 专注者 - 金色
        };
        
        const levelBgColors = {
            1: 'rgba(136, 136, 170, 0.1)',
            2: 'rgba(108, 140, 255, 0.1)',
            3: 'rgba(76, 175, 80, 0.1)',
            4: 'rgba(255, 209, 102, 0.1)'
        };
        
        interactiveFeedback.style.borderColor = levelColors[engagementLevel];
        interactiveFeedback.style.backgroundColor = levelBgColors[engagementLevel];
        interactiveFeedback.style.color = levelColors[engagementLevel];
        
        // 更新标题颜色提示
        const titleElement = document.getElementById('body-part-title');
        if (titleElement) {
            titleElement.style.textShadow = `0 0 10px ${levelColors[engagementLevel]}`;
        }
        
        // 更新参与度进度条
        updateEngagementProgressBar(engagementScore);
    }
    
    // 更新参与度进度条
    function updateEngagementProgressBar(engagementScore) {
        const progressBar = document.getElementById('engagement-progress-bar');
        const progressText = document.getElementById('engagement-progress-text');
        
        if (!progressBar || !progressText) return;
        
        // 计算当前等级的进度百分比
        // 等级1: 0-25分, 等级2: 26-50分, 等级3: 51-75分, 等级4: 76-100分
        let levelProgress = 0;
        let levelMin = 0, levelMax = 25;
        
        switch(engagementLevel) {
            case 1:
                levelMin = 0; levelMax = 25;
                break;
            case 2:
                levelMin = 26; levelMax = 50;
                break;
            case 3:
                levelMin = 51; levelMax = 75;
                break;
            case 4:
                levelMin = 76; levelMax = 100;
                break;
        }
        
        // 计算在当前等级内的进度百分比
        if (engagementLevel < 4) {
            levelProgress = ((engagementScore - levelMin) / (levelMax - levelMin)) * 100;
        } else {
            // 等级4是最高等级，进度为100%
            levelProgress = 100;
        }
        
        // 确保进度在0-100之间
        levelProgress = Math.max(0, Math.min(100, levelProgress));
        
        // 计算整体进度条宽度（考虑等级偏移）
        const overallProgress = (engagementLevel - 1) * 25 + (levelProgress / 100) * 25;
        
        // 更新进度条
        progressBar.style.width = `${overallProgress}%`;
        
        // 更新进度文本
        const levelName = getEngagementLevelName(engagementLevel);
        const nextLevel = engagementLevel < 4 ? engagementLevel + 1 : 4;
        const nextLevelName = getEngagementLevelName(nextLevel);
        
        if (engagementLevel < 4) {
            progressText.textContent = `参与度: ${levelName} (${Math.round(levelProgress)}% → ${nextLevelName})`;
        } else {
            progressText.textContent = `参与度: ${levelName} (最高等级)`;
        }
    }
    
    // 播放放松音效
    function playRelaxSound() {
        // 在实际应用中，这里会播放音频
        // 由于没有音频文件，我们使用控制台日志和震动反馈（如果支持）
        console.log('播放放松音效');
        
        // 尝试触发设备震动（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
    
    // 更新完成界面的分数显示
    function updateCompletionScore() {
        const relaxedCount = relaxationStatus.filter(status => status).length;
        const totalSteps = activeSteps.length;
        const progressPercent = Math.round((relaxedCount / totalSteps) * 100);
        
        // 更新DOM元素
        document.getElementById('final-score').textContent = totalScore;
        document.getElementById('relaxed-count').textContent = relaxedCount;
        
        // 根据分数计算评级
        let rating = '初级';
        if (progressPercent >= 90) {
            rating = '大师级';
        } else if (progressPercent >= 70) {
            rating = '高级';
        } else if (progressPercent >= 50) {
            rating = '中级';
        }
        
        document.getElementById('rating').textContent = rating;
        
        // 计算并显示参与度等级
        engagementLevel = calculateEngagementLevel();
        const levelName = getEngagementLevelName(engagementLevel);
        const levelDesc = getEngagementLevelDescription(engagementLevel);
        
        // 更新参与度等级显示（如果元素不存在则创建，如果存在则更新内容）
        let engagementDisplay = document.querySelector('.engagement-display');
        if (!engagementDisplay) {
            engagementDisplay = document.createElement('div');
            engagementDisplay.className = 'engagement-display';
            // 插入到积分显示之后
            const scoreDisplay = document.querySelector('.score-display');
            if (scoreDisplay) {
                scoreDisplay.parentNode.insertBefore(engagementDisplay, scoreDisplay.nextSibling);
            }
        }
        // 更新参与度显示内容
        engagementDisplay.innerHTML = `
            <div class="engagement-level">
                <h3><i class="fas fa-user-check"></i> 参与度分析</h3>
                <p>您的参与度等级: <strong>${levelName}</strong></p>
                <p>${levelDesc}</p>
            </div>
        `;
        
        // 更新星星显示（根据评级）
        const stars = document.querySelectorAll('.stars i');
        stars.forEach((star, index) => {
            if (progressPercent >= (index + 1) * 33) {
                star.style.color = '#ffd166'; // 金色
                star.style.textShadow = '0 0 10px rgba(255, 209, 102, 0.5)';
                // 添加闪烁动画
                star.style.animation = 'none';
                setTimeout(() => {
                    star.style.animation = `starPop 0.6s ease-out ${0.2 + index * 0.3}s both, starTwinkle 3s infinite ${1 + index * 0.5}s`;
                }, 10);
            } else {
                star.style.color = '#6868a0'; // 暗灰色
                star.style.textShadow = 'none';
                star.style.animation = `starPop 0.6s ease-out ${0.2 + index * 0.3}s both`;
            }
        });
    }
    
    // 创建粒子效果
    function createParticles(x, y, particleCount = 8) {
        const colors = ['#6c8cff', '#8a9eff', '#4caf50', '#ffd166'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机颜色
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            // 随机位置偏移
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            // 设置位置和偏移方向
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            // 使用CSS变量传递偏移量给动画
            particle.style.setProperty('--offset-x', `${offsetX}px`);
            particle.style.setProperty('--offset-y', `${offsetY}px`);
            
            // 添加到body
            document.body.appendChild(particle);
            
            // 动画
            particle.style.animation = `particle-pop 0.8s ease-out forwards`;
            
            // 动画结束后移除
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 850);
        }
    }

    function goToPreviousStep() {
        if (currentStepIndex > 0) {
            stopSpeaking(); // 停止当前语音（包括链式追加语音）
            currentStepIndex--;
            loadStep(currentStepIndex);
        }
    }

    function goToNextStep() {
        // 如果是最后一步，显示完成屏幕
        if (currentStepIndex === activeSteps.length - 1) {
            showScreen(completionScreen);
            stopCountdown();
            stopSpeaking(); // 停止当前语音
            fadeOutAmbient(); // 淡出环境音
            setTimeout(() => { stopAmbientSound(); }, 2000); // 淡出后彻底停止
            isMusicPlaying = false; // 标记音乐已停止
            updateMusicUI();
            // 停止呼吸动画帧
            if (breathAnimFrame) {
                cancelAnimationFrame(breathAnimFrame);
                breathAnimFrame = null;
            }
            updateCompletionScore(); // 更新完成界面的分数
            saveTodayRecord(); // 保存睡眠日程记录
            updateSleepDiaryUI(); // 更新睡眠日程显示
            // 播放结束引导语音
            playEndingVoice();
            return;
        }
        
        stopSpeaking(); // 停止当前语音（包括链式追加语音）
        currentStepIndex++;
        loadStep(currentStepIndex);
    }

    function restartRelaxation() {
        // 重置所有状态
        totalScore = 0;
        currentStepRelaxed = false;
        consecutiveEngagedSteps = 0;
        engagementLevel = 1;
        relaxationStatus = activeSteps.map(() => false);
        engagementData = activeSteps.map(() => ({
            clicked: false,
            clickTime: 0,
            clickCount: 0,
            stepStartTime: 0
        }));
        
        // 移除完成界面的参与度显示（如果存在）
        const engagementDisplay = document.querySelector('.engagement-display');
        if (engagementDisplay) {
            engagementDisplay.remove();
        }
        
        // 重置标题样式
        const titleElement = document.getElementById('body-part-title');
        if (titleElement) {
            titleElement.style.textShadow = '';
        }
        
        // 停止当前语音
        stopSpeaking();
        
        // 重置音乐播放状态（完成时被设为false，重新开始应恢复）
        isMusicPlaying = true;
        updateMusicUI();
        
        // 重新开始放松（会重新初始化音频和语音）
        startRelaxation();
    }

    function goToHome() {
        showScreen(welcomeScreen);
        stopCountdown();
        // 停止呼吸动画计时器
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
        }
        // 停止呼吸动画帧
        if (breathAnimFrame) {
            cancelAnimationFrame(breathAnimFrame);
            breathAnimFrame = null;
        }
        // 恢复呼吸圈CSS动画（为下次进入准备）
        const breathingCircle = document.getElementById('breathing-circle');
        if (breathingCircle) {
            breathingCircle.classList.remove('js-driven');
            breathingCircle.style.transform = '';
            breathingCircle.style.boxShadow = '';
        }
        // 停止环境音和人声
        fadeOutAmbient();
        stopSpeaking();
        setTimeout(() => { stopAmbientSound(); }, 2000);
        isMusicPlaying = true; // 回到首页重置为默认开启
        updateMusicUI();
    }

    // ==================== 返回首页确认弹窗 ====================
    function showHomeConfirm() {
        // 如果已有弹窗，先移除
        const existing = document.getElementById('home-confirm-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'home-confirm-modal';
        modal.innerHTML = `
            <div class="confirm-overlay"></div>
            <div class="confirm-dialog">
                <p class="confirm-text">确定要返回首页吗？<br>当前进度将不会保存。</p>
                <div class="confirm-buttons">
                    <button class="confirm-cancel">继续放松</button>
                    <button class="confirm-ok">返回首页</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 绑定按钮事件
        modal.querySelector('.confirm-cancel').addEventListener('click', function() {
            modal.remove();
        });
        modal.querySelector('.confirm-ok').addEventListener('click', function() {
            modal.remove();
            goToHome();
        });
        modal.querySelector('.confirm-overlay').addEventListener('click', function() {
            modal.remove();
        });
    }

    // ==================== 倒计时功能 ====================
    let isWaitingForBreathCycle = false; // 是否在等待呼吸周期完成

    function startCountdown() {
        // 清除现有计时器
        stopCountdown();
        isWaitingForBreathCycle = false;
        
        // 更新显示
        updateCountdownDisplay();
        
        // 设置计时器
        countdownTimer = setInterval(() => {
            countdownSeconds--;
            
            if (countdownSeconds <= 0) {
                // 倒计时结束，等当前呼吸周期完成再切换（呼吸对齐）
                if (!isWaitingForBreathCycle) {
                    isWaitingForBreathCycle = true;
                    updateCountdownDisplay(); // 显示"呼吸中..."
                    waitForBreathCycleEnd(function() {
                        isWaitingForBreathCycle = false;
                        // 如果语音还在播放，等播完再切换（避免追加语音被强制切断）
                        if (VoicePlayer.isPlaying) {
                            waitForVoiceEnd(function() {
                                if (currentStepIndex < activeSteps.length - 1) {
                                    goToNextStep();
                                } else {
                                    stopCountdown();
                                    updateCountdownDisplay();
                                }
                            });
                        } else {
                            if (currentStepIndex < activeSteps.length - 1) {
                                goToNextStep();
                            } else {
                                stopCountdown();
                                updateCountdownDisplay();
                            }
                        }
                    });
                }
            } else {
                updateCountdownDisplay();
            }
        }, 1000);
    }

    // 等待当前呼吸周期结束后执行回调
    function waitForBreathCycleEnd(callback) {
        // 计算当前呼吸周期还剩多少时间
        const totalCycleTime = breathInhaleTime + breathHoldTime + breathExhaleTime;
        const elapsed = performance.now() - breathCycleStart;
        const cycleElapsed = elapsed % totalCycleTime;
        const remainingMs = totalCycleTime - cycleElapsed;

        // 等剩余时间+100ms缓冲后执行回调
        const waitTime = Math.max(100, remainingMs + 100);
        setTimeout(callback, waitTime);
    }

    // 等待语音播放结束后执行回调（最多等5秒兜底）
    function waitForVoiceEnd(callback) {
        if (!VoicePlayer.isPlaying) {
            callback();
            return;
        }
        var checkCount = 0;
        var check = setInterval(function() {
            checkCount++;
            if (!VoicePlayer.isPlaying || checkCount > 50) { // 50×100ms=5秒兜底
                clearInterval(check);
                callback();
            }
        }, 100);
    }

    function stopCountdown() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    }

    function updateCountdownDisplay() {
        countdownElement.textContent = countdownSeconds;
        
        // 如果倒计时为0且正在等待呼吸周期完成
        if (countdownSeconds <= 0 && isWaitingForBreathCycle) {
            timerElement.textContent = "完成本轮呼吸...";
        } else if (countdownSeconds <= 0) {
            timerElement.textContent = "准备下一步...";
        } else {
            timerElement.textContent = `保持放松: ${countdownSeconds}秒`;
        }
    }

    // ==================== 呼吸动画 ====================
    // 呼吸动画参数（由 updateBreathingAnimation 设置）
    let breathInhaleTime = 3000;
    let breathHoldTime = 1000;
    let breathExhaleTime = 4000;
    let breathCycleStart = 0;
    let breathAnimFrame = null;

    function updateBreathingAnimation() {
        // 根据选择的呼吸速度设置阶段时间（毫秒）
        switch(breathSpeed) {
            case 'slow':
                // 慢速：吸气4秒，屏息2秒，呼气6秒（共12秒）
                breathInhaleTime = 4000;
                breathHoldTime = 2000;
                breathExhaleTime = 6000;
                break;
            case 'fast':
                // 快速：吸气2秒，屏息1秒，呼气3秒（共6秒）
                breathInhaleTime = 2000;
                breathHoldTime = 1000;
                breathExhaleTime = 3000;
                break;
            case 'medium':
            default:
                // 中速：吸气3秒，屏息1秒，呼气4秒（共8秒）
                breathInhaleTime = 3000;
                breathHoldTime = 1000;
                breathExhaleTime = 4000;
                break;
        }

        const totalCycleTime = breathInhaleTime + breathHoldTime + breathExhaleTime;

        // 停用CSS动画，改由JS驱动
        const breathingCircle = document.getElementById('breathing-circle');
        if (breathingCircle) {
            breathingCircle.style.animation = 'none';
            // 强制重排以应用 animation:none
            void breathingCircle.offsetWidth;
        }
        // 外层光晕环也停用CSS动画
        const ringBefore = breathingCircle ? breathingCircle.querySelector('::before') : null;
        // ::before/::after 无法直接用JS操作，通过CSS类控制
        if (breathingCircle) {
            breathingCircle.classList.add('js-driven');
        }

        // 清除旧的动画帧和计时器
        if (breathAnimFrame) {
            cancelAnimationFrame(breathAnimFrame);
            breathAnimFrame = null;
        }
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
        }

        breathCycleStart = performance.now();

        // 用 requestAnimationFrame 驱动呼吸圈缩放，与文字完全同步
        function animateBreath(timestamp) {
            const elapsed = timestamp - breathCycleStart;
            const cycleElapsed = elapsed % totalCycleTime;

            const circle = document.getElementById('breathing-circle');
            if (!circle || !relaxationScreen.classList.contains('active')) {
                breathAnimFrame = null;
                return;
            }

            let scale, shadow, phase;

            if (cycleElapsed < breathInhaleTime) {
                // 吸气阶段：0.8 → 1.2
                const progress = cycleElapsed / breathInhaleTime;
                const eased = easeInOutCubic(progress);
                scale = 0.8 + 0.4 * eased;
                shadow = 20 + 20 * eased;
                phase = 'inhale';
            } else if (cycleElapsed < breathInhaleTime + breathHoldTime) {
                // 屏息阶段：保持1.2
                scale = 1.2;
                shadow = 40;
                phase = 'hold';
            } else {
                // 呼气阶段：1.2 → 0.8
                const exhaleProgress = (cycleElapsed - breathInhaleTime - breathHoldTime) / breathExhaleTime;
                const eased = easeInOutCubic(exhaleProgress);
                scale = 1.2 - 0.4 * eased;
                shadow = 40 - 20 * eased;
                phase = 'exhale';
            }

            circle.style.transform = `scale(${scale})`;
            circle.style.boxShadow = `0 0 ${shadow}px rgba(108, 140, 255, ${0.15 + (scale - 0.8) * 0.375}), inset 0 0 ${shadow * 0.75}px rgba(108, 140, 255, ${0.05 + (scale - 0.8) * 0.125})`;

            // 更新文字
            if (phase !== breathingPhase) {
                breathingPhase = phase;
                if (phase === 'inhale') {
                    breathingText.textContent = '吸气...';
                    playBreathVoice('inhale');
                } else if (phase === 'hold') {
                    breathingText.textContent = '屏息...';
                    playBreathVoice('hold');
                } else {
                    breathingText.textContent = '呼气...';
                    playBreathVoice('exhale');
                }
            }

            breathAnimFrame = requestAnimationFrame(animateBreath);
        }

        breathAnimFrame = requestAnimationFrame(animateBreath);
    }

    // 缓动函数：让呼吸动画更自然
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // ==================== 音乐控制 ====================
    function toggleMusic() {
        // 如果当前环境音类型为"无"，切换到雨声
        if (currentSoundType === 'none') {
            currentSoundType = 'rain';
            // 更新环境音选项UI
            const soundOptions = document.querySelectorAll('.sound-option');
            soundOptions.forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-sound') === 'rain');
            });
            isMusicPlaying = true;
            initAudio();
            playAmbientSound();
        } else {
            isMusicPlaying = !isMusicPlaying;
            if (isMusicPlaying) {
                if (!audioContext) initAudio();
                playAmbientSound();
            } else {
                fadeOutAmbient();
            }
        }
        updateMusicUI();
    }

    function updateMusicUI() {
        const icon = musicToggle.querySelector('i');
        
        if (isMusicPlaying && currentSoundType !== 'none') {
            icon.className = 'fas fa-volume-up';
            musicToggle.style.color = '#8a9eff';
            const soundNames = { rain: '雨声', ocean: '海浪', stream: '溪流', campfire: '篝火', crickets: '虫鸣', whitenoise: '白噪音', none: '环境音' };
            musicInfo.textContent = `环境音: ${soundNames[currentSoundType] || '雨声'}`;
        } else {
            icon.className = 'fas fa-volume-mute';
            musicToggle.style.color = '#8888aa';
            musicInfo.textContent = currentSoundType === 'none' ? '环境音: 已关闭' : '环境音: 已暂停';
        }
    }

    // ==================== 键盘快捷键 ====================
    document.addEventListener('keydown', function(event) {
        // 只在放松界面启用快捷键
        if (!relaxationScreen.classList.contains('active')) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                goToPreviousStep();
                break;
            case 'ArrowRight':
            case ' ':
                event.preventDefault();
                goToNextStep();
                break;
            case 'Escape':
                event.preventDefault();
                goToHome();
                break;
        }
    });

    // ==================== 触摸设备优化 ====================
    let touchStartX = 0;
    
    relaxationScreen.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });
    
    relaxationScreen.addEventListener('touchend', function(event) {
        const touchEndX = event.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        
        // 滑动距离大于50px触发
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // 向左滑动，下一步
                goToNextStep();
            } else {
                // 向右滑动，上一步
                goToPreviousStep();
            }
        }
    }, { passive: true });

    // ==================== 星空背景动画 ====================
    function initStarfield() {
        const canvas = document.getElementById('starfield');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // 生成星星
        const stars = [];
        const starCount = 120;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.05,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
                const alpha = star.opacity * twinkle;
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 200, 255, ${alpha})`;
                ctx.fill();

                // 较大的星星加光晕
                if (star.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(108, 140, 255, ${alpha * 0.1})`;
                    ctx.fill();
                }

                // 缓慢移动
                star.y += star.speed;
                if (star.y > canvas.height + 5) {
                    star.y = -5;
                    star.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ==================== 初始化应用程序 ====================
    init();
    
    // 控制台提示
    console.log('渐进放松助眠游戏已加载完成！');
    console.log('使用说明:');
    console.log('- 点击"开始放松之旅"开始');
    console.log('- 使用左右箭头键或屏幕上的按钮导航');
    console.log('- 在放松界面，可以左右滑动切换步骤');
    console.log('- 按ESC键返回首页');
    console.log('- 每个步骤有自动倒计时，结束后会自动进入下一步');
});