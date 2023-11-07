export class Metronome {
  private audioContext;
  private notesInQueue = [] as { note: number; time: number }[]; // notes that have been put into the web audio and may or may not have been played yet {note, time}
  private currentBeatInBar = 0;
  private beatsPerBar = 1;
  public tempo = 120;
  private lookahead = 25; // How frequently to call scheduling function (in milliseconds)
  private scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  private nextNoteTime = 0.0; // when the next note is due
  private isRunning = false;
  private intervalID = -1;

  constructor(tempo: number) {
    this.tempo = tempo;
    this.audioContext = new window.AudioContext();
  }

  nextNote() {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    const secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    this.currentBeatInBar++; // Advance the beat number, wrap to zero
    if (this.currentBeatInBar == this.beatsPerBar) {
      this.currentBeatInBar = 0;
    }
  }

  scheduleNote(beatNumber: number, time: number) {
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: beatNumber, time: time });

    // create an oscillator
    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.frequency.value = beatNumber % this.beatsPerBar == 0 ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
      this.nextNote();
    }
  }

  async start() {
    if (this.isRunning) return;
    await this.audioContext.close();
    this.audioContext = new window.AudioContext();
    this.isRunning = true;

    this.currentBeatInBar = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    this.isRunning = false;
    this.notesInQueue = [];
    clearInterval(this.intervalID);
  }

  startStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }
}
