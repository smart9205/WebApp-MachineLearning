import CryptoJS from 'crypto-js'
import fileDownload from 'js-file-download'
import { SECRET } from "../config/settings"
import { DEMO } from "./staticData"

export const createCommand = (tagList, url, name) => {

  const command = `ffmpeg -y -i "${url}" -f lavfi -i color=color=#808080@0.7:size=240x60,format=rgba -f lavfi -i color=color=#FFA500@0.7:size=240x60,format=rgba -i "https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png" -filter_complex "${tagList.map((tag, i) =>
    `[0:v]trim=${toSecond(tag.start_time)}:${toSecond(tag.end_time)},setpts=PTS-STARTPTS[v${i}];[1:v]drawtext=text='${tag.action_name ?? "TEAM_ACTION"}':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=40:fontcolor=white[trans_gray_tx${i ? i : ''}];[v${i}][trans_gray_tx${i ? i : ''}]overlay=shortest=1:x=20:y=H-h-20[v_${i}];[0:a]atrim=${toSecond(tag.start_time)}:${toSecond(tag.end_time)},asetpts=PTS-STARTPTS[a${i}];`).join("")
    }${tagList.map((tag, i) => `[v_${i}][a${i}]`).join("")
    }[v_${tagList.length}][a${tagList.length}]concat=n=${tagList.length}:v=1:a=1[outv][outa];[2:v]drawtext=text='# Kanga G':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=40:fontcolor=white[trans_org_tx];[outv][trans_org_tx]overlay=shortest=1:x=262:y=H-h-20[v_org];[v_org][${tagList.length}:v]overlay=W-w-20:H-h-20[v_t_logo]" -map "[v_t_logo]" -map "[outa]" -preset fast ${name}.mp4`

  fileDownload(command, `${name}.bat`);
}

export function toHHMMSS(data) {
  if (!data || data === "") return "00:00:00"
  let sec_num = parseInt(data, 10); // don't forget the second param
  if (sec_num < 0) sec_num = 0;
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

export function addSecToHHMMSS(str, sec) {
  return toHHMMSS(toSecond(str) + sec)
}

export function toSecond(data) {
  if (!data || data === "") return 0
  let a = data.split(':'); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}
export function getUser() {
  try {
    const user = localStorage.getItem("user")
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("user"), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return user
  } catch (e) {
    console.error("loading user error");
    return null
  }
}
export function setUser(user) {
  try {
    localStorage.setItem("user", CryptoJS.AES.encrypt(JSON.stringify(user), SECRET).toString());
  } catch (e) {
    console.error("saving user error");
  }
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export function divideTags(tagList) {
  let actions = {}
  tagList.forEach(tag => {
    const actionKey = tag.action_name
    const typeKey = tag.action_type_name
    let success = actions?.[actionKey]?.[typeKey]?.success ?? []
    let unsuccess = actions?.[actionKey]?.[typeKey]?.unsuccess ?? []

    if (DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
    } else {
      unsuccess = [...unsuccess, tag]
    }

    actions = {
      ...actions,
      [actionKey]: {
        ...actions?.[actionKey],
        [typeKey]: { success, unsuccess }
      }
    }
  })
  return actions
}

export function filterSuccessTags(tagList) {
  let actions = {}
  tagList.forEach(tag => {
    const actionKey = tag.action_name
    let success = actions?.[actionKey] ?? []

    if (DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
      actions = {
        ...actions,
        [actionKey]: [success]
      }
    }
  })
  return actions
}

export function getPercent(value, max) {
  return value * 100 / max;
}

const filterData = [
  {
    title: "Goal", action: 1, action_type: null, action_result: [3],
  },
  {
    title: "Assist", action: 9, action_type: null, action_result: null,
  },
  {
    title: "Shot", action: 1, action_type: null, action_result: [1],
  },
  {
    title: "Cross", action: 3, action_type: null, action_result: [4],
  },
  {
    title: "Dribble", action: 4, action_type: null, action_result: [4],
  },
  {
    title: "Through Pass", action: 2, action_type: 6, action_result: [4],
  },
  {
    title: "Short Pass", action: 2, action_type: 4, action_result: [4],
  },
  {
    title: "Long Pass", action: 2, action_type: 5, action_result: [4],
  },
  {
    title: "Key Pass", action: 2, action_type: 7, action_result: [4],
  },
  {
    title: "Header Pass", action: 2, action_type: 3, action_result: [4],
  },
  {
    title: "Draw Foul", action: 6, action_type: null, action_result: [13, 14],
  },
  {
    title: "Interception", action: 10, action_type: null, action_result: null,
  },
  {
    title: "Clearence", action: 11, action_type: null, action_result: null,
  },
  {
    title: "Saved", action: 8, action_type: null, action_result: null,
  },
  {
    title: "Throw-In", action: 2, action_type: 14, action_result: [4],
  },
]
export function manualFilterForTags(tagList, playerId) {
  return filterData.map(f => {
    const total = tagList.filter(tag => tag.action_id === f.action &&
      (f.action_type === null ? true : tag.action_type_id === f.action_type) &&
      (f.action_result === null ? true : f.action_result.includes(tag.action_result_id))
    )
    return {
      title: f.title,
      success: total.filter(f => f.player_id === playerId),
      total: total.length
    }
  })
    .filter(f => f.success.length > 0)
}
export function filterAllTags(tagList, playerId) {
  let actions = {}
  const playerTag = tagList.filter(f => f.player_id === playerId)
  playerTag.forEach(tag => {
    const actionKey = tag.action_name

    actions = {
      ...actions,
      [actionKey]: !actions?.[actionKey] ?
        {
          total: 1,
          success: []
        } : {
          ...actions?.[actionKey],
          total: actions?.[actionKey].total + 1
        }
    }

    let success = actions?.[actionKey]?.success ?? []

    if (tag.player_id === playerId && DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
      actions = {
        ...actions,
        [actionKey]: {
          ...actions?.[actionKey],
          success
        }
      }
    }
  })

  // then sort by success length

  return Object.keys(actions).map(key => { return { ...actions[key], action: key } }).sort((a, b) => b.total - a.total)
}