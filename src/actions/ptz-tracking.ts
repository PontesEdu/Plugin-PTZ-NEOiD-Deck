import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";


@action({ UUID: "com.neoid.ptzneoid.ptz-tracking" })
export class PTZTracking extends SingletonAction {
  private pressTimer: any = null;
  private longPress = false;

  public trackingModes = [
    { value: "tracking", name: "Presenter" },
    { value: "region", name: "Zona" },
    { value: "autoframe", name: "Auto\nFrame" },
  ];


  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP as string;
    
    if (!cameraIP) {
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      ev.action.setImage("imgs/actions/tracking/tracking-off");
      return;
    }

    // Recupera do globals ou define valores padrão
    const lastMode = String(globals[`trackingMode_${cameraIP}`] || this.trackingModes[0].value);
    const trackingActive = Boolean(globals[`trackingActive_${cameraIP}`]);

    const modeInfo = this.trackingModes.find(m => m.value === lastMode) || this.trackingModes[0];

    // Atualiza visual de acordo com estado salvo
    ev.action.setTitle(modeInfo.name);
    ev.action.setImage(trackingActive ? "imgs/actions/tracking/tracking-on" : "imgs/actions/tracking/tracking-off");

    // Garante que os valores existam no globals
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`trackingMode_${cameraIP}`]: lastMode,
      [`trackingActive_${cameraIP}`]: trackingActive,
    });
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP as string;

    if (!cameraIP) {
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      ev.action.setImage("imgs/actions/tracking/tracking-off");
      return;
    }

    const lastMode = String(globals[`trackingMode_${cameraIP}`] || this.trackingModes[0].value);
    const trackingActive = Boolean(globals[`trackingActive_${cameraIP}`]);

    const modeInfo = this.trackingModes.find(m => m.value === lastMode) || this.trackingModes[0];

    // Atualiza o botão quando as settings mudam
    ev.action.setTitle(modeInfo.name);
    ev.action.setImage(trackingActive ? "imgs/actions/tracking/tracking-on" : "imgs/actions/tracking/tracking-off");
  }


  override async onKeyDown(ev: KeyDownEvent) {
    this.longPress = false;
    if (this.pressTimer) clearTimeout(this.pressTimer);

    this.pressTimer = setTimeout(async () => {
      this.longPress = true;
      this.pressTimer = null;
      await this.toggleTracking(ev);
    }, 700);
  }

  override async onKeyUp(ev: KeyUpEvent) {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }

    if (!this.longPress) {
      await this.cycleMode(ev);
    }
    // se foi longPress, toggleTracking já foi chamado no timer
  }

  // ----------------------------
  // lógica de cycle (clique curto)
  private async cycleMode(ev: any) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP as string;
    if (!cameraIP) {
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      return;
    }

    const lastMode = String(globals[`trackingMode_${cameraIP}`] || this.trackingModes[0].value);
    const trackingActive = Boolean(globals[`trackingActive_${cameraIP}`]);

    const currentIndex = this.trackingModes.findIndex(m => m.value === lastMode);
    const nextIndex = (currentIndex + 1) % this.trackingModes.length;
    const nextMode = this.trackingModes[nextIndex];

    // se o modo anterior estava ativo, desativa o tracking (apenas uma vez)
    if (trackingActive) {
      await this.sendTrackingActive(cameraIP, false);
    }

    // salva próximo modo como DESATIVADO
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`trackingMode_${cameraIP}`]: nextMode.value,
      [`trackingActive_${cameraIP}`]: false,
    });

    // visual (sempre off após trocar de modo)
    ev.action.setTitle(nextMode.name);
    ev.action.setImage("imgs/actions/tracking/tracking-off");

    // envia comando para alterar o modo na câmera
    await this.sendTrackingMode(cameraIP, nextMode.value);
  }

  // ----------------------------
  // lógica de toggle (longpress)
  private async toggleTracking(ev: any) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP as string;

    if (!cameraIP) {
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      return;
    }

    const lastMode = String(globals[`trackingMode_${cameraIP}`] || this.trackingModes[0].value);
    const trackingActive = Boolean(globals[`trackingActive_${cameraIP}`]);
    const modeInfo = this.trackingModes.find(m => m.value === lastMode) || this.trackingModes[0];

    const newActive = !trackingActive;

    // atualiza visual imediatamente para dar feedback ao usuário
    ev.action.setTitle(modeInfo.name);
    ev.action.setImage(newActive ? "imgs/actions/tracking/tracking-on" : "imgs/actions/tracking/tracking-off");

    // envia comando de ativar/desativar
    await this.sendTrackingActive(cameraIP, newActive);

    // salva estado
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`trackingMode_${cameraIP}`]: lastMode,
      [`trackingActive_${cameraIP}`]: newActive,
    });
  }

  // ----------------------------
  // envia o comando para trocar o modo (postfulltrack -> fallback write_path)
  private async sendTrackingMode(cameraIP: string, mode: string) {
    try {
      const params = new URLSearchParams();
      params.append("cururl", "http://");
      params.append("path", "/data/track.conf");
      params.append("common.track_mode", mode);

      const res = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?postfulltrack`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!res.ok) {
        await fetch(`http://${cameraIP}/cgi-bin/param.cgi?write_path`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      }
    } catch (e) {
      // silencioso - não trava a UI
    }
  }

  // envia o comando para ativar/desativar tracking (write_path -> fallback postfulltrack)
  private async sendTrackingActive(cameraIP: string, active: boolean) {
    const viscaParams = new URLSearchParams();
    viscaParams.append("cururl", "http://");
    viscaParams.append("path", "/data/track.conf");
    viscaParams.append("common.track", active ? "1" : "0");

    try {
      await fetch(`http://${cameraIP}/cgi-bin/param.cgi?write_path`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: viscaParams.toString(),
      });
    } catch {
      await fetch(`http://${cameraIP}/cgi-bin/param.cgi?postfulltrack`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: viscaParams.toString(),
      });
    }
  }

  // para pegar info da camera
  async fetchCameraTracking(cameraIP: string) {
    const globals = await streamDeck.settings.getGlobalSettings();

    const parseConfig = (conf: string) => {
      const confLines = conf.split(/\r?\n/);

      let trackActive = false;
      let trackMode = this.trackingModes[0].value;

      confLines.forEach((line) => {
        const temp = line.split(/"([^"]*)"/g);
        if (temp[0].startsWith("common.track=")) {
          trackActive = temp[1] === "1";
        }
        if (temp[0].startsWith("common.track_mode=")) {
          trackMode = temp[1];
        }
      });
      const modeInfo = this.trackingModes.find(m => m.value === trackMode) || this.trackingModes[0];
      return { trackMode: modeInfo.value, trackActive };
    };

    try {
      
      const resGet = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?getfulltrack`);
      if (resGet.ok) {
        const conf = await resGet.text();
        const parsed = parseConfig(conf);

        await streamDeck.settings.setGlobalSettings({
          ...globals,
          [`trackingMode_${cameraIP}`]: parsed.trackMode,
          [`trackingActive_${cameraIP}`]: parsed.trackActive,
        });

        return parsed;
      }
    } catch (e) {
      console.warn(`GET getfulltrack falhou para ${cameraIP}, tentando POST...`);
    }

    try {
      
      const resPost = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_path`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "path=/data/track.conf",
      });

      if (resPost.ok) {
        const conf = await resPost.text();
        const parsed = parseConfig(conf);

        await streamDeck.settings.setGlobalSettings({
          ...globals,
          [`trackingMode_${cameraIP}`]: parsed.trackMode,
          [`trackingActive_${cameraIP}`]: parsed.trackActive,
        });

        return parsed;
      }
    } catch (e) {
      // error
    }

    return null;
  }
}