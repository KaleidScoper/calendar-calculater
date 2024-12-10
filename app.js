document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datePicker');
    const markButton = document.getElementById('markButton');
    const unmarkButton = document.getElementById('unmarkButton');
    const ctx = document.getElementById('predictionChart').getContext('2d');
    const dateList = document.getElementById('dateList');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'A日期间隔天数',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            }
        }
    });

    function updateChart(data) {
        chart.data.labels = data.labels;       // 更新日期标签
        chart.data.datasets[0].data = data.values; // 更新数据
        chart.update();
    }

    function updateDateList(data) {
        dateList.innerHTML = ''; // 清空列表
        data.events.forEach(event => {
            if (event.is_a_date) {
                const listItem = document.createElement('li');
                listItem.textContent = event.date;
                dateList.appendChild(listItem);
            }
        });
    }

    function sendRequest(endpoint, postData) {
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(postData)
        }).then(res => res.json());
    }

    markButton.addEventListener('click', () => {
        const date = datePicker.value;
        if (date) {
            sendRequest('mark_date.php', { date, is_a_date: true }).then(() => {
                alert('日期已标记为A日期！');
                fetchChartData();
            });
        } else {
            alert('请选择一个日期！');
        }
    });

    unmarkButton.addEventListener('click', () => {
        const date = datePicker.value;
        if (date) {
            sendRequest('mark_date.php', { date, is_a_date: false }).then(() => {
                alert('标记已取消！');
                fetchChartData();
            });
        } else {
            alert('请选择一个日期！');
        }
    });

    function fetchChartData() {
        fetch('get_data.php')
            .then(res => res.json())
            .then(data => {
                updateChart(data);       // 更新统计图
                updateDateList(data);    // 更新标记的日期列表
            });
    }

    fetchChartData(); // 初始加载数据
});
