'use client'
import React, { useState, useRef, useEffect } from 'react'
import useCountDown from 'react-countdown-hook'
import useSound from 'use-sound'
import { shuffle, useTabActive } from '~/utils/helpers'
import * as flashsetAPI from '~/apis/flashsets'

export default function Play({
  flashsetId,
  width,
  height,
  cards,
  onPageChange,
  onResult,
  onHeart,
}) {
  const tabActive = useTabActive()
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')
  const frontAnswersText = useRef([
    ...cards.map((i) => i.frontText).filter((i) => !!i),
  ])
  const backAnswersText = useRef([
    ...cards.map((i) => i.backText).filter((i) => !!i),
  ])
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState({
    text: '',
    answerTrue: '',
    answers: [],
  })
  const [selected, setSelected] = useState(-1)
  const [isCorrect, setIsCorrect] = useState(null)
  const [hamburgers, setHamburgers] = useState([])
  const [heartRemain, setHeartRemain] = useState(3)

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    90 * 1000,
    1000
  )
  const result = useRef([])
  const isStarted = useRef(false)

  useEffect(() => {
    start()
    setTimeout(() => (isStarted.current = true), 2000)
  }, [])
  useEffect(() => {
    if (isStarted.current == true && timeLeft == 0 && tabActive) {
      onPageChange(4)
    }
  }, [timeLeft, tabActive])

  useEffect(() => {
    if (index === -1 || index >= cards.length) return
    console.log(index, 'index')
    // Start Time countdown
    // if (index === 0) start()

    const card = cards[index]
    const ques = question
    const isFront =
      card.frontText && card.backText.length > 0
        ? getRandomInt(1, 9) % 2 === 0
        : true

    if (isFront) {
      ques.text = card.frontText
      ques.answerTrue = card.backText
      const randAnswers = shuffle(backAnswersText.current)
      const _answers = randAnswers
        .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
        .slice(0, 3)
      ques.answers = shuffle([..._answers, ques.answerTrue])
      setQuestion({ ...ques })
      // refCard.current.setCard(card)
    } else {
      ques.text = card.backText
      ques.answerTrue = card.frontText
      const randAnswers = shuffle(frontAnswersText.current)
      const _answers = randAnswers
        .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
        .slice(0, 3)
      ques.answers = shuffle([..._answers, ques.answerTrue])
      setQuestion({ ...ques })
    }
  }, [index])

  useEffect(() => {
    if (isCorrect != null && result.current.filter((i) => !i).length < 3) {
      setTimeout(() => {
        setIsCorrect(null)
        setSelected(-1)
        setIndex((s) => (cards[s + 1] ? s + 1 : 0))
        // setIndex((s) => s + 1)
        // if (index + 1 >= cards.length) {
        //   setTimeout(() => {
        //     onPageChange(4)
        //   }, 2000)
        // }
      }, 500)
      flashsetAPI
        .histories(flashsetId, 'burger', [
          { id: cards[index].id, result: isCorrect },
        ])
        .then(() => {
          // queryClient.refetchQueries(['flashset', flashsetId])
        })
    }
  }, [isCorrect, index])

  const handleAnswer = (answer) => () => {
    if (isCorrect != null) return
    if (question.answerTrue === answer) {
      playSuccess()
      setIsCorrect(true)
      result.current.push(true)
    } else {
      playWrong()
      setIsCorrect(false)
      result.current.push(false)
      setHeartRemain((s) => {
        const remain = s - 1
        if (remain == 0) {
          setTimeout(() => onPageChange(3), 1000)
        }
        onHeart?.(remain)
        return remain
      })
    }
    setSelected(question.answers.findIndex((i) => i === answer))
    if (result.current.length >= 7) {
      setHamburgers((s) => {
        const ham = [...s, result.current.every((i) => !!i)]
        onResult?.(ham)
        return ham
      })
      result.current = []
    }
  }

  if (!question?.text) return null

  return (
    <div className='relative flex flex-col' style={{ width, height }}>
      <img
        src='/img/hamburger/chocokobato_galactic_background.png'
        alt='hamburger'
        style={{
          width,
          height,
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        className='cursor-pointer object-fill'
      />
      <img
        src='/img/hamburger/monster.gif'
        alt='hamburger'
        style={{
          width: height * 0.4,
          height: height * 0.4,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          objectFit: 'fill',
        }}
      />
      <img
        src='/img/hamburger/thinking.png'
        alt='hamburger'
        style={{
          width: height * 0.55,
          height: height * 0.6,
          position: 'absolute',
          top: 16,
          alignSelf: 'center',
          objectFit: 'fill',
        }}
      />
      <img
        src='/img/hamburger/laula.png'
        alt='laula'
        style={{
          width: height * 0.2,
          height: height * 0.2,
          objectFit: 'fill',
          position: 'absolute',
          left: width * 0.2,
          bottom: 20,
        }}
      />
      <div
        style={{
          width: width * 0.25,
          height: height * 0.14,
          position: 'absolute',
          left: width * 0.13,
          bottom: height * 0.21,
          alignSelf: 'center',
          objectFit: 'fill',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <img
          src='/img/hamburger/home_intro.png'
          alt='hamburger'
          style={{
            width: width * 0.25,
            height: height * 0.14,
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            alignSelf: 'center',
            objectFit: 'fill',
          }}
        />
        <span
          style={{
            position: 'absolute',
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          {question.text}
        </span>
      </div>

      <div
        className='flex flex-col items-center'
        style={{
          position: 'absolute',
          width: height * 0.2,
          height,
          bottom: 20,
          left: 20,
        }}
      >
        <img
          src='/img/hamburger/laula.png'
          alt='laula'
          style={{
            width: height * 0.2,
            height: height * 0.2,
            objectFit: 'fill',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 0,
          }}
        />
        {hamburgers.map((i, idx) => (
          <img
            key={idx}
            src='/img/hamburger/burger.png'
            alt='laula'
            // className='burger_anim'
            style={{
              width: height * 0.1,
              height: height * 0.1,
              objectFit: 'fill',
              position: 'absolute',
              bottom: height * 0.04 + height * 0.1 * (idx + 1) - 10 * idx,
              marginLeft: height * 0.05,
              zIndex: idx + 1,
              animation: `run linear infinite ${2 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          width: height * 0.18,
          height: height * 0.18,
          position: 'absolute',
          top: 20,
          left: width * 0.16,
          borderRadius: '100%',
          fontSize: height * 0.08,
          fontWeight: '600',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          objectFit: 'fill',
          border: '4px dashed #fff',
          color: '#fff',
          backgroundColor: '#ff9f9f',
        }}
      >
        {timeLeft / 1000}
      </div>

      <div
        style={{
          width: width * 0.25,
          position: 'absolute',
          right: 16,
          bottom: 16,
          alignSelf: 'center',
          objectFit: 'fill',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {question?.answers?.map?.((answer, idx) => (
          <div
            key={idx}
            style={{
              width: width * 0.25,
              height: height * 0.14,
              alignSelf: 'center',
              objectFit: 'fill',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              padding: 16,
            }}
            onClick={handleAnswer(answer)}
          >
            <img
              src={`/img/hamburger/answer${idx + 1}.png`}
              alt='hamburger'
              style={{
                width: width * 0.25,
                height: height * 0.14,
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: 0,
                right: 0,
                alignSelf: 'center',
                objectFit: 'fill',
                backgroundColor:
                  idx == selected
                    ? isCorrect
                      ? '#01ac47'
                      : '#fe415a'
                    : '#ffd9da',
                borderRadius: 12,
              }}
            />
            <span
              style={{
                position: 'absolute',
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {answer}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          // width: width * 0.25,
          // height: height * 0.14,
          position: 'absolute',
          right: 48,
          top: 16,
          objectFit: 'fill',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignSelf: 'center',
          gap: 8,
        }}
      >
        <img
          src={`/img/hamburger/${heartRemain < 3 ? 'heart1' : 'heart'}.png`}
          alt='heart1'
          style={{
            width: height * 0.1,
            height: height * 0.1,
            alignSelf: 'center',
            objectFit: 'fill',
          }}
        />
        <img
          src={`/img/hamburger/${heartRemain < 2 ? 'heart1' : 'heart'}.png`}
          alt='heart1'
          style={{
            width: height * 0.1,
            height: height * 0.1,
            objectFit: 'fill',
          }}
        />
        <img
          src={`/img/hamburger/${heartRemain < 1 ? 'heart1' : 'heart'}.png`}
          alt='heart1'
          style={{
            width: height * 0.1,
            height: height * 0.1,
            objectFit: 'fill',
          }}
        />
      </div>

      <div
        style={{
          width: width * 0.12,
          height: height * 0.3,
          position: 'absolute',
          top: height * 0.1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        {result.current.length > 6 && (
          <img
            src='/img/hamburger/hamburger_top.png'
            alt='heart1'
            style={{
              width: width * 0.12,
              height: width * 0.08,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.55,
              zIndex: 9,
            }}
            className='hideMe opacity-0'
          />
        )}
        {result.current.length > 6 && (
          <img
            // src='/img/hamburger/hamburger_omelet.png'
            src={`/img/hamburger/hamburger_${
              result.current[6] ? 'omelet' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.09,
              height: width * 0.04,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.55,
              zIndex: 8,
            }}
          />
        )}
        {result.current.length > 5 && (
          <img
            // src='/img/hamburger/hamburger_onion.png'
            src={`/img/hamburger/hamburger_${
              result.current[5] ? 'onion' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.12,
              height: width * 0.04,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.55,
              zIndex: 7,
            }}
          />
        )}
        {result.current.length > 4 && (
          <img
            // src='/img/hamburger/hamburger_shirmp.png'
            src={`/img/hamburger/hamburger_${
              result.current[4] ? 'shirmp' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.09,
              height: width * 0.04,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.55,
              zIndex: 5,
            }}
          />
        )}
        {result.current.length > 3 && (
          <img
            // src='/img/hamburger/hamburger_sausage.png'
            src={`/img/hamburger/hamburger_${
              result.current[3] ? 'sausage' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.1,
              height: width * 0.05,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.7,
              zIndex: 4,
            }}
          />
        )}
        {result.current.length > 2 && (
          <img
            src={`/img/hamburger/hamburger_${
              result.current[2] ? 'ham' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.12,
              height: width * 0.07,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -1,
              zIndex: 3,
            }}
          />
        )}
        {result.current.length > 1 && (
          <img
            src={`/img/hamburger/hamburger_${
              result.current[1] ? 'salad' : 'worm'
            }.png`}
            alt='heart1'
            style={{
              width: width * 0.12,
              height: width * 0.07,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.95,
              zIndex: 2,
            }}
          />
        )}
        {result.current.length > 0 && (
          <img
            src={`/img/hamburger/hamburger_${
              result.current[0] ? 'cheese' : 'worm'
            }.png`}
            // src='/img/hamburger/hamburger_cheese.png'
            alt='heart1'
            style={{
              width: width * 0.12,
              height: width * 0.07,
              objectFit: 'fill',
              marginBottom: width * 0.06 * -0.8,
              zIndex: 1,
            }}
          />
        )}
        <img
          src='/img/hamburger/hamburger_bottom.png'
          alt='heart1'
          style={{
            width: width * 0.12,
            height: width * 0.07,
            objectFit: 'fill',
            zIndex: 0,
          }}
        />
      </div>
    </div>
  )
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
