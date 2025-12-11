# algorithms/sorting.py

from typing import List, Dict, Any

def bubble_sort_steps(arr: List[int]) -> List[Dict[str, Any]]:
    steps = []
    a = arr.copy()
    n = len(a)

    # начальное состояние
    steps.append({
        "array": a.copy(),
        "compare": None,
        "swap": None,
        "description": "Начальное состояние массива"
    })

    for i in range(n):
        for j in range(0, n - i - 1):
            # шаг сравнения
            steps.append({
                "array": a.copy(),
                "compare": [j, j + 1],
                "swap": None,
                "description": f"Сравнение элементов с индексами {j} и {j + 1}"
            })

            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]

                # шаг после обмена
                steps.append({
                    "array": a.copy(),
                    "compare": [j, j + 1],
                    "swap": [j, j + 1],
                    "description": f"Обмен элементов с индексами {j} и {j + 1}"
                })

    steps.append({
        "array": a.copy(),
        "compare": None,
        "swap": None,
        "description": "Массив отсортирован"
    })

    return steps