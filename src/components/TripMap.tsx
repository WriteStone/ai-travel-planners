'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    AMap: any
  }
}

interface TripMapProps {
  itinerary: any
}

export default function TripMap({ itinerary }: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current || !window.AMap) return

    // Initialize map
    map.current = new window.AMap.Map(mapContainer.current, {
      zoom: 12,
      center: [116.397428, 39.90923], // Default to Beijing
      mapStyle: 'amap://styles/normal',
    })

    // Add markers and routes
    if (itinerary?.days) {
      const markers: any[] = []
      const paths: any[] = []

      itinerary.days.forEach((day: any) => {
        day.activities?.forEach((activity: any) => {
          if (activity.coordinates) {
            const { lat, lng } = activity.coordinates
            
            // Add marker
            const marker = new window.AMap.Marker({
              position: [lng, lat],
              title: activity.name,
              label: {
                content: activity.name,
                direction: 'top',
              },
            })

            markers.push(marker)
            paths.push([lng, lat])

            // Add info window
            const infoWindow = new window.AMap.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="font-weight: bold; margin-bottom: 5px;">${activity.name}</h3>
                  <p style="margin: 5px 0;">${activity.description}</p>
                  <p style="color: #666; font-size: 12px;">${activity.time} | ${activity.duration}</p>
                  <p style="color: #0ea5e9; font-weight: bold;">¥${activity.cost}</p>
                </div>
              `,
            })

            marker.on('click', () => {
              infoWindow.open(map.current, marker.getPosition())
            })
          }
        })
      })

      // Add all markers to map
      map.current.add(markers)

      // Draw polyline for route
      if (paths.length > 1) {
        const polyline = new window.AMap.Polyline({
          path: paths,
          borderWeight: 3,
          strokeColor: '#0ea5e9',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
        })

        map.current.add(polyline)
      }

      // Fit view to show all markers
      if (markers.length > 0) {
        map.current.setFitView(markers, false, [50, 50, 50, 50])
      }
    }

    return () => {
      map.current?.destroy()
    }
  }, [itinerary])

  return (
    <div className="space-y-4">
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg border border-gray-200" />
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📍 地图使用说明</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 点击标记查看景点详细信息</li>
          <li>• 蓝色线条显示推荐的游览路线</li>
          <li>• 可以缩放和拖动地图查看更多细节</li>
          <li>• 标记按每日行程顺序排列</li>
        </ul>
      </div>
    </div>
  )
}
