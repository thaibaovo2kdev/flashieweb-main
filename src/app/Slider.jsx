'use client'

import dynamic from 'next/dynamic'
import React, { Component } from 'react'
// import Carousel from 'react-spring-3d-carousel'
import { config } from 'react-spring'

const Carousel = dynamic(() => import('react-spring-3d-carousel'), {
  ssr: false,
})
// const spring = dynamic(() => import('react-spring'), {
//   ssr: false,
// })

const getTouches = (evt) => {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  )
}

export default class Example extends Component {
  state = {
    // goToSlide: 0,
    // offsetRadius: 4,
    // showNavigation: true,
    // // config: config.slow,
    // dragging: false,
    // dragStartX: 0,
    // dragOffset: 0,
    goToSlide: 0,
    offsetRadius: 2,
    showNavigation: true,
    enableSwipe: true,
    // config: spring.config.slow,
  }

  slides = [
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/flipflop_banner.jpg'
          alt='1'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/matchflash_banner.png'
          alt='2'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/flashie_banner.png'
          alt='3'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/burger.png'
          alt='4'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/flipflop_banner.jpg'
          alt='5'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/matchflash_banner.png'
          alt='6'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
    {
      key: Math.random().toString(),
      content: (
        <img
          src='/img/burger.png'
          alt='7'
          draggable={false}
          className='!max-w-full rounded-2xl'
        />
      ),
    },
  ].map((slide, index) => {
    return { ...slide, onClick: () => this.setState({ goToSlide: index }) }
  })

  onMouseDown = (e) => {
    this.setState({
      dragging: true,
      dragStartX: e.clientX,
      dragOffset: 0,
    })
  }

  onMouseMove = (e) => {
    if (this.state.dragging) {
      const dragOffset = e.clientX - this.state.dragStartX
      this.setState({
        dragOffset,
      })
    }
  }

  onMouseUp = () => {
    if (this.state.dragging) {
      const { dragOffset } = this.state
      const dragThreshold = 50

      if (dragOffset > dragThreshold) {
        this.setState((prevState) => ({
          goToSlide: prevState.goToSlide - 1 < 0 ? 0 : prevState.goToSlide - 1,
          dragging: false,
          dragStartX: 0,
          dragOffset: 0,
        }))
      } else if (dragOffset < -dragThreshold) {
        this.setState((prevState) => ({
          goToSlide:
            prevState.goToSlide + 1 >= this.slides.length
              ? this.slides.length - 1
              : prevState.goToSlide + 1,
          dragging: false,
          dragStartX: 0,
          dragOffset: 0,
        }))
      } else {
        this.setState({
          dragging: false,
          dragStartX: 0,
          dragOffset: 0,
        })
      }
    }
  }

  render() {
    const { goToSlide } = this.state
    return (
      <div
        className='h-[50vh] max-h-[500px] w-full lg:w-[100%]'
        // style={{ margin: '0 auto' }}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <Carousel
          slides={this.slides}
          goToSlide={this.state.goToSlide}
          offsetRadius={this.state.offsetRadius}
          animationConfig={this.state.config}
        />
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '24px',
              cursor: goToSlide === 0 ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              color: goToSlide === 0 ? '#888' : '#000',
            }}
            onClick={() =>
              goToSlide > 0 && this.setState({ goToSlide: goToSlide - 1 })
            }
          >
            &#8249;
          </span>
          {this.slides.map((slide, index) => (
            <span
              key={slide.key}
              style={{
                display: 'inline-block',
                fontSize: '16px',
                cursor: 'pointer',
                margin: '0 5px',
                color: index === goToSlide ? '#000' : '#888',
              }}
              onClick={() => this.setState({ goToSlide: index })}
            >
              &bull;
            </span>
          ))}
          <span
            style={{
              display: 'inline-block',
              fontSize: '24px',
              cursor:
                goToSlide === this.slides.length - 1
                  ? 'not-allowed'
                  : 'pointer',
              color: goToSlide === this.slides.length - 1 ? '#888' : '#000',
            }}
            onClick={() =>
              goToSlide < this.slides.length - 1 &&
              this.setState({ goToSlide: goToSlide + 1 })
            }
          >
            &#8250;
          </span>
        </div>
      </div>
    )
  }
}
