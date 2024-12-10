document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datePicker');
    const markButton = document.getElementById('markButton');
    const unmarkButton = document.getElementById('unmarkButton');
    const ctx = document.getElementById('predictionChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '预测下次事件A',
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
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.update();
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
            sendRequest('mark_date.php', { date, is_a_date: true }).then(response => {
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
            sendRequest('mark_date.php', { date, is_a_date: false }).then(response => {
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
            .then(data => updateChart(data));
    }

    fetchChartData(); // 初始加载数据
});
