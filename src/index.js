import PoseHandler from "./handlers/poseHandler";
import TimerHandler from "./handlers/timerHandler";
import ScoreHandler from "./handlers/scoreHandler";
import SettingsHandler from "./handlers/settingsHandler";

document.addEventListener("DOMContentLoaded", async () => {
  let webcamElem = document.getElementById("webcamBox");
  const cnvPoseElem = document.getElementById("cnvPoseBox");
  const parentWebcamElem = document.getElementById("parentWebcamBox");

  const loaderElem = document.getElementById("loaderBox");
  const fpsElem = document.getElementById("fpsBox");
  const countElem = document.getElementById("countBox");
  const timerElem = document.getElementById("timerBox");
  const delayElem = document.getElementById("delayBox");
  const pauseBtnElem = document.getElementById("pauseBtn");
  const resumeBtnElem = document.getElementById("resumeBtn");
  const accessCamBtnElem = document.getElementById("accessCamBtn");

  const chooseWOElem = document.getElementById("chooseWOBox");
  const formChooseWOElem = document.getElementById("formChooseWOBox");
  const accessCamElem = document.getElementById("accessCamBox");
  const titleWOElem = document.getElementById("titleWOBox");
  const confidenceElem = document.getElementById("confidenceBox");
  const resultElem = document.getElementById("resultBox");
  const resultRepElem = document.getElementById("resultRepBox");
  const resultTitleElem = document.getElementById("resultTitleBox");
  const resultOKBtnElem = document.getElementById("resultOKBtn");
  const uploadVideoBtnElem = document.getElementById("uploadVideoBtn");
  const goWebcamBtnElem = document.getElementById("goWebcamBtn");

  const settingsBtnElem = document.getElementById("settingsBtn");
  const settingsElem = document.getElementById("settingsBox");
  const saveSettingsBtnElem = document.getElementById("saveSettingsBtn");
  const cancelSettingsBtnElem = document.getElementById("cancelSettingsBtn");
  const segSettingsWOBtnElem = document.getElementById("segSettingsWOBtn");
  const segSettingsAdvBtnElem = document.getElementById("segSettingsAdvBtn");
  const bodySettingsWOElem = document.getElementById("bodySettingsWOBox");
  const bodySettingsAdvElem = document.getElementById("bodySettingsAdvBox");

  const scoresBtnElem = document.getElementById("scoresBtn");
  const scoresElem = document.getElementById("scoresBox");
  const scoresOKBtnElem = document.getElementById("scoresOKBtn");
  const segJourneyBtnElem = document.getElementById("segJourneyBtn");
  const segBestBtnElem = document.getElementById("segBestBtn");
  const bodyJourneyElem = document.getElementById("bodyJourneyBox");
  const bodyBestScoreElem = document.getElementById("bodyBestScoreBox");

  const helpElem = document.getElementById("helpBox");
  const helpBtnElem = document.getElementById("helpBtn");
  const segHowToUseBtnElem = document.getElementById("segHowToUseBtn");
  const segAboutBtnElem = document.getElementById("segAboutBtn");
  const bodyHowToUseElem = document.getElementById("bodyHowToUseBox");
  const bodyAboutElem = document.getElementById("bodyAboutBox");
  const helpOKBtnElem = document.getElementById("helpOKBtn");

  const developerModeElem = document.getElementById("developerModeBox");
  const imgDirectionSignElem = document.getElementById("imgDirectionSignBox");
  const goAdviceBtnElem = document.getElementById("goAdviceBtn");
  const adviceWrapElem = document.getElementById("adviceWrapBox");
  const sliderAdviceElem = document.getElementById("sliderAdviceBox");
  const sliderCameraElem = document.getElementById("sliderCameraBox");
  const recordKeypointsBtnElem = document.getElementById("recordKeypointsBtn");
  const pingRecordElem = document.getElementById("pingRecordBox");
  const restartBtnElem = document.getElementById("restartBtn");

  let isFirstPlay = true;
  let isWebcamSecPlay = false;
  let widthRealVideo = 640;
  let heightRealVideo = 360;
  let widthResult = 0;
  let heightResult = 0;
  const ratio = {
    h: 9,
    w: 16,
  };

  const WOPose = new PoseHandler(webcamElem, cnvPoseElem);
  const WOTimer = new TimerHandler();
  const WOScore = new ScoreHandler();
  const WOSettings = new SettingsHandler();

  WOPose.additionalElem = {
    fpsElem,
    countElem,
    adviceWrapElem,
    confidenceElem,
    imgDirectionSignElem,
  };

  // eslint-disable-next-line no-underscore-dangle
  WOPose.camHandler._addVideoConfig = {
    width: widthRealVideo,
    height: heightRealVideo,
  };

  const resizeHandler = () => {
    widthResult = window.innerWidth > 1280 ? 1280 : window.innerWidth;
    heightResult = Math.floor(widthResult * (ratio.h / ratio.w));
    if (heightResult > window.innerHeight) {
      heightResult = window.innerHeight;
      widthResult = Math.floor(heightResult * (ratio.w / ratio.h));
    }

    parentWebcamElem.setAttribute(
      "style",
      `width:${widthResult}px;height:${heightResult}px`
    );

    for (let i = 0; i < parentWebcamElem.children.length; i += 1) {
      const element = parentWebcamElem.children[i];
      if (element.tagName === "CANVAS") {
        cnvPoseElem.width = widthResult;
        cnvPoseElem.height = heightResult;
      } else {
        element.style.width = `${widthResult}px`;
        element.style.height = `${heightResult}px`;
      }
    }

    WOPose.scaler = {
      w: widthResult / widthRealVideo,
      h: heightResult / heightRealVideo,
    };
  };

  // First run to auto adjust screen
  resizeHandler();

  window.addEventListener("resize", () => {
    resizeHandler();
  });

  // Render current settings and show to choose new settings
  const getHTMLChooseWO = (data, isSettings) => {
    // isSettings (true) to Advance Settings segment
    let htmlChooseWO = "";
    htmlChooseWO += isSettings
      ? `
      <div class="mb-3">What workout do you want?</div>
      `
      : `
      <div class="flex-1 overflow-y-auto flex flex-col items-center w-full">
        <h1 class="font-bold text-2xl mt-3 mb-5">AI Workout Assistant</h1>
        <div class="relative w-full flex flex-row justify-center items-center">
          <img
            src="./img/undraw_pilates_gpdb.svg"
            alt="Ilustration of Workout"
            class="w-1/2"
          />
          <div id="chooseHelpBtn" class="absolute top-0 bg-yellow-500 text-white font-bold py-1 px-2 rounded-lg cursor-pointer hover:bg-amber-500">Need Help ?</div>
        </div>
        <div class="mt-5 mb-3">What workout do you want?</div>
      `;

    data.nameWorkout.forEach((nameWO, idx) => {
      if (idx === 0) {
        htmlChooseWO += `<fieldset class="grid grid-cols-2 gap-3 w-full">`;
      }
      htmlChooseWO += `
        <label
          for="${isSettings ? `settingsName${idx}` : `chooseName${idx}`}"
          class="flex cursor-pointer items-center pl-4 border border-gray-200 rounded-lg"
        >
          <input
            id="${isSettings ? `settingsName${idx}` : `chooseName${idx}`}"
            type="radio"
            value="${data.slugWorkout[idx]}"
            name="${isSettings ? "settingsNameWO" : "chooseNameWO"}"
            class="w-4 h-4 text-yellow-600"
            required
          />
          <span class="w-full py-4 ml-2 text-sm font-medium text-gray-600"
            >${nameWO}</span
          >
        </label>
        `;
      if (idx === data.nameWorkout.length - 1) {
        htmlChooseWO += `</fieldset>`;
      }
    });

    htmlChooseWO += `<div class="${
      isSettings ? "mt-3" : "mt-5"
    } mb-3">How long?</div>`;

    data.duration.forEach((duration, idx) => {
      if (idx === 0) {
        htmlChooseWO += `<fieldset class="grid grid-cols-2 gap-3 w-full">`;
      }
      htmlChooseWO += `
        <label
          for="${
            isSettings ? `settingsDuration${idx}` : `chooseDuration${idx}`
          }"
          class="flex cursor-pointer items-center pl-4 border border-gray-200 rounded-lg"
        >
          <input
            id="${
              isSettings ? `settingsDuration${idx}` : `chooseDuration${idx}`
            }"
            type="radio"
            value="${duration}"
            name="${isSettings ? "settingsDurationWO" : "chooseDurationWO"}"
            class="w-4 h-4 text-yellow-600"
            required
          />
          <span class="w-full py-4 ml-2 text-sm font-medium text-gray-600"
            >${duration}</span
          >
        </label>
        `;
      if (idx === data.duration.length - 1) {
        htmlChooseWO += `</fieldset>`;
      }
    });

    htmlChooseWO += isSettings
      ? ""
      : `
        </div>
        <button
          id="submitWOBtn"
          type="submit"
          class="w-full bg-yellow-500 text-white py-2 text-xl font-bold rounded-lg mb-2 mt-5 hover:bg-amber-500"
        >
          Next
        </button>
      `;

    return htmlChooseWO;
  };
  
})